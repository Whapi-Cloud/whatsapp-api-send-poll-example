## Creating polls as an alternative to interactive buttons in WhatsApp
Interactive buttons in WhatsApp are a very handy tool for working with customers. 
For the user, polls and interactive buttons are functionally similar. And the mechanism of working with a poll is very similar to that of buttons.
We have prepared a simple and easy to understand source code for you to implement in your survey response integration or bot.

### A detailed article on how to use polls as buttons in WhatsApp
https://support.whapi.cloud/help-desk/how-to/how-to-use-polls-as-buttons

## Getting Started
https://support.whapi.cloud/help-desk/getting-started/getting-started
### How to Connect to Whapi.Cloud
Registration. The first step is to register on the Whapi.Cloud website and create an account. <b>It's free and doesn't require you to enter a credit card.</b>
After registration you will immediately have access to a test channel with a small limitation. Wait for it to start (it usually takes about a minute). You will need to connect your phone for Whatsapp automation. It is from the connected phone that messages will be sent. The big advantage of the service is that it takes only a couple of minutes to launch and start working.

To connect your phone, use the QR code available when you click on your trial channel in your personal account. Then open WhatsApp on your mobile device, go to Settings -> Connected devices -> Connect device -> Scan QR code.

In the second and third steps, the service will ask you to customize the channel: write its name for your convenience, set webhooks, change settings. All these steps can be skipped, and we will come back to webhooks a little later. After launching, you will find in the center block under the information about limits, your API KEY, that is Token. This token will be used to authenticate your API requests. Generally, it's added to the request headers as a Bearer Token or simply as a request parameter, depending on the API method you're using.

Working with hooks: https://support.whapi.cloud/help-desk/guides/complete-guide-to-webhooks-on-whatsapp-api
