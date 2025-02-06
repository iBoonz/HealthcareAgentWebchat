(function () { { requestChatBot(); } })();
const defaultLocale = 'en-US';

function requestChatBot() {
    const params = new URLSearchParams(location.search);
    const oReq = new XMLHttpRequest();
    oReq.addEventListener("load", initBotConversation);
    var path = "https://<your-function-app-name>.azurewebsites.net/api/GenereratorFunction";
    oReq.open("POST", path);
    oReq.send();
}

function initBotConversation() {
    if (this.status >= 400) {
        alert(this.statusText);
        return;
    }
    // extract the data from the JWT
    const jsonWebToken = this.response;
    const tokenPayload = JSON.parse(atob(jsonWebToken.split('.')[1]));
    const user = {
        id: tokenPayload.userId,
        name: tokenPayload.userName,
        locale: defaultLocale
    };

   
    var botConnection = window.WebChat.createDirectLine({
        token: tokenPayload.connectorToken,
    });
    const styleOptions = {
        botAvatarImage: 'https://learn.microsoft.com/en-us/training/achievements/create-bots-azure-health-bot.svg',
        // botAvatarInitials: '',
        // userAvatarImage: '',
        hideSendBox: false, /* set to true to hide the send box from the view */
        botAvatarInitials: 'Bot',
        userAvatarInitials: 'You',
        backgroundColor: '#F8F8F8'
    };

    const store = window.WebChat.createStore({}, function (store) {
        return function (next) {
            return function (action) {
                if (action.type === 'DIRECT_LINE/CONNECT_FULFILLED') {
                    store.dispatch({
                        type: 'DIRECT_LINE/POST_ACTIVITY',
                        meta: { method: 'keyboard' },
                        payload: {
                            activity: {
                                type: "invoke",
                                name: "InitConversation",
                                locale: user.locale,
                                value: {
                                    // must use for authenticated conversation.
                                    jsonWebToken: jsonWebToken,

                                    // Use the following activity to proactively invoke a bot scenario
                                    /*
                                    triggeredScenario: {
                                        trigger: "{scenario_id}",
                                        args: {
                                            location: location,
                                            myVar1: "{custom_arg_1}",
                                            myVar2: "{custom_arg_2}"
                                        }
                                    }
                                    */
                                }
                            }
                        }
                    });

                }
                else if (action.type === 'DIRECT_LINE/INCOMING_ACTIVITY') {
                    if (action.payload && action.payload.activity && action.payload.activity.type === "event" && action.payload.activity.name === "ShareLocationEvent") {
                        // share
                        getUserLocation(function (location) {
                            store.dispatch({
                                type: 'WEB_CHAT/SEND_POST_BACK',
                                payload: { value: JSON.stringify(location) }
                            });
                        });
                    }
                }
                return next(action);
            }
        }
    });
    const webchatOptions = {
        directLine: botConnection,
        styleOptions: styleOptions,
        store: store,
        userID: user.id,
        username: user.name,
        locale: user.locale
    };
    startChat(user, webchatOptions);
}

function startChat(user, webchatOptions) {
    const botContainer = document.getElementById('botContainer');
    window.WebChat.renderWebChat(webchatOptions, botContainer);
}