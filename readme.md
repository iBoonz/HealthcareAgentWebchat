## Deploy to Azure

Click the button below to deploy this project to Azure:

[![Deploy to Azure](https://aka.ms/deploytoazurebutton)](https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FiBoonz%2FHealthcareAgentWebchat%2Frefs%2Fheads%2Fmain%2Fazuredeploy.json%3Ftoken%3DGHSAT0AAAAAAC5LTMBZY5GTIJ6UAYIOTKOCZ5E6MSQ)

You will need to set the following parameters:
- `storageAccountName`: Name of the storage account
- `functionAppName`: Name of the Azure Function app
- `appSecret`: Secret for your app
- `webchatSecret`: Secret for your web chat