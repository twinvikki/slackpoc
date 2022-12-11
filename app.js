const { App } = require("@slack/bolt");
const jsforce = require('jsforce');
const express = require('express');
require('dotenv').config();
const app = new App({
    token: process.env.SLACK_BOT_TOKEN,
    signingSecret: process.env.SLACK_SIGNING_SECRET,
    socketMode:true, // enable the following to use socket mode
    appToken: process.env.APP_TOKEN
  });
  
  (async () => {
    const port = 3000;
    //const eApp = express();
    const conn = new jsforce.Connection({
          // you can change loginUrl to connect to sandbox or prerelease env.
          loginUrl : 'https://login.salesforce.com'
        });
        const userInfo = await conn.login(
            process.env.SF_USERNAME,
            process.env.SF_PASSWORD+process.env.SF_TOKEN);
          await app.start(process.env.PORT || port);
          console.log(`⚡️ Slack Bolt app is running on port ${port}! ${userInfo.id}`);
  })();
  app.event('app_home_opened', async ({ event, client, context }) => {
    try {
      const conn = new jsforce.Connection({
        // you can change loginUrl to connect to sandbox or prerelease env.
         loginUrl : 'https://login.salesforce.com'
      });
      const userInfo = await conn.login(
        process.env.SF_USERNAME,
        process.env.SF_PASSWORD
      );
      await ack;
      /* view.publish is the method that your app uses to push a view to the Home tab */
      const result = await client.views.publish({
  
        /* the user that opened your app's app home */
        user_id: event.user,
  
        /* the view object that appears in the app home*/
        view: {
          type: 'home',
          callback_id: 'home_view',
  
          /* body of the view */
          blocks: [
            {
              "type": "section",
              "text": {
                "type": "mrkdwn",
                "text": `*Welcome to your _App's Home_* :tada:${userInfo.id}`

              }
            },
            {
              "type": "divider"
            },
            {
              "type": "section",
              "text": {
                "type": "mrkdwn",
                "text": "This button won't do much for now but you can set up a listener for it using the `actions()` method and passing its unique `action_id`. See an example in the `examples` folder within your Bolt app."
              }
            },
            {
              "type": "actions",
              "elements": [
                {
                  "type": "button",
                  "text": {
                    "type": "plain_text",
                    "text": "Click me!"
                  },
                  "value": "click_me_123",
                  "action_id": "actionSubmit"
                }
              ]
            }
          ]
        }
      });
    }
    catch (error) {
      console.error(error);
    }
  });

  app.action("actionSubmit",async ({body,ack,say,payload,client})=>{
    const userId = payload.user;
    try {
      // Call the views.publish method using the WebClient passed to listeners
      const result = await client.views.publish({
        user_id: userId,
        view: {
          // Home tabs must be enabled in your app configuration page under "App Home"
          "type": "home",
          "blocks": [
            {
              "type": "section",
              "text": {
                "type": "mrkdwn",
                "text": "*Welcome home, <@" + userId + "> :house:*"
              }
            },
            {
              "type": "section",
              "text": {
                "type": "mrkdwn",
                "text": "Learn how home tabs can be more useful and interactive <https://api.slack.com/surfaces/tabs/using|*in the documentation*>."
              }
            },
            {
              "type": "divider"
            },
            {
              "type": "context",
              "elements": [
                {
                  "type": "mrkdwn",
                  "text": "Psssst this home tab was designed using <https://api.slack.com/tools/block-kit-builder|*Block Kit Builder*>"
                }
              ]
            }
          ]
        }
      });
  
      console.log(result);
    }
    catch (error) {
      console.error(error);
    }
  });