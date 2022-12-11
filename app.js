const { App, HTTPResponseAck } = require("@slack/bolt");
const { Surfaces, Blocks, Elements, Bits, Utilities }  = require('slack-block-builder');
const jsforce = require('jsforce');
const express = require('express');
require('dotenv').config();
const appHome = require('./homeapp');

  const app = new App({
      token: process.env.SLACK_BOT_TOKEN,
      signingSecret: process.env.SLACK_SIGNING_SECRET,
      socketMode:true, // enable the following to use socket mode
      appToken: process.env.APP_TOKEN
  });

  (async () => {
    const port = 3000;  
          await app.start(process.env.PORT || port);
          console.log(`⚡️ Slack Bolt app is running on port ${port}! `);
  })();
   app.event('app_home_opened', async ({ event,payload, client, context }) => {  
      const conn = new jsforce.Connection({
        // you can change loginUrl to connect to sandbox or prerelease env.
          loginUrl : 'https://login.salesforce.com'
      });
     await conn.login(
        process.env.SF_USERNAME,
        process.env.SF_PASSWORD+process.env.SF_TOKEN
      ,(err)=>{
        if(err)
        {
          console.error(err);
        }
        else
        {
          conn.apex.get("/UpdateAccount/", function(err, res) {
            if (err) 
            { 
              return console.error(err); 
            }
            else
            {
              const homeView =  appHome.createHome(res);
              console.log('JSON.str-->'+JSON.stringify(homeView));
              try {
                const result =   app.client.views.publish({
                  token: context.botToken,
                  user_id: payload.user,
                  view: homeView
                });
                
              } catch(e) {
                app.error(e);
              }
            }
          });
          }
      });
});

app.action("button-action",async ({body,ack,client,context})=>{
   ack();
   const view = appHome.openModal();
   try {
    const result = await app.client.views.open({
      token: context.botToken,
      trigger_id: body.trigger_id,
      view: view
    });
    
  } catch(e) {
    console.log(e);
    app.error(e);
  }
});
  app.view('modal-callback-id', async ({ ack, body,response_action,context }) => {
    await ack({
      response_action: 'clear',
    });
    let testData = body.view.state.values;
    var keys = Object.keys(testData);
    let testD = keys[0];
    console.log(keys[0]);
    let finData = testData[testD];
    let accName;
    for (const property in finData) {
     accName =  `${finData[property].value}`;
    }
    let jBody = {"wReqcon":[{ wName: accName }]};
    const conn = new jsforce.Connection({
      // you can change loginUrl to connect to sandbox or prerelease env.
        loginUrl : 'https://login.salesforce.com'
    });
   await conn.login(
      process.env.SF_USERNAME,
      process.env.SF_PASSWORD+process.env.SF_TOKEN
    ,(err)=>{
      if(err)
      {
        console.error(err);
      }
      else
      {
        conn.apex.post("/UpdateAccount/", jBody, function(err, res) {
          if (err) { return console.error(err); }
          else
          {
            const homeView =  appHome.createHome(res);
            try {
              const result = app.client.apiCall('views.publish', {
                token: context.botToken,
                user_id: body.user.id,
                view: homeView
              });
          
            } catch(e) {
              console.log(e);
              app.error(e);
            }
          }
          console.log("response: ", JSON.stringify(res));          
        });
      }
    });
    console.log('accName-->'+accName);
  });
  app.view({ callback_id: 'modal-callback-id', type: 'view_closed' }, async ({ ack, body, view, client }) => {
    // Acknowledge the view_closed request
    await ack();
    // react on close request
  });

  module.exports = { app };
