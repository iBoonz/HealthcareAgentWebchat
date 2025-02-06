## Deploy to Azure

Click the button below to deploy this project to Azure:

[![Deploy to Azure](https://aka.ms/deploytoazurebutton)](https://portal.azure.com/#create/Microsoft.Template/uri/https://raw.githubusercontent.com/iBoonz/HealthcareAgentWebchat/main/azuredeploy.json)

You will need to set the following parameters:
- `storageAccountName`: Name of the storage account
- `functionAppName`: Name of the Azure Function app
- `appSecret`: Secret for your app
- `webchatSecret`: Secret for your web chat