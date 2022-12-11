
const app = require('./app');
const jsforce = require('jsforce');
const e = require('express');
const updateView = (res) => {
    let blocks = [ 
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: "*Welcome!* \nThis is a home for EPAM POC. You can view recently created 5 of your accounts here!"
          },
          accessory: {
            type: "button",
            action_id: "button-action", 
            text: {
              type: "plain_text",
              text: "Create Account",
              emoji: true
            }
          }
        },
        {
          type: "context",
          elements: [
            {
              type: "mrkdwn",
              text: ":wave: Hey, my source code is on <https://glitch.com/edit/#!/apphome-demo-note|glitch>!"
            }
          ]
        },
        {
          type: "divider"
        }
      ];
        if(res !== undefined)
        { 
        let noteBlocks = [];
            for (const o of res) {
                noteBlocks = [
                    {
                      type: "section",
                      text: {
                        type: "mrkdwn",
                        text: o.Name
                      },
                      accessory: {
                        type: "button",
                        action_id: "edit_account", 
                        text: {
                          type: "plain_text",
                          text: "Edit Account",
                          emoji: true
                        }
                      }
                    },
                    {
                      "type": "context",
                      "elements": [
                        {
                          "type": "mrkdwn",
                          "text": o.Phone ? o.Phone : '122344'
                        }
                      ]
                    },
                    {
                      type: "divider"
                    }
                  ];
                  blocks = blocks.concat(noteBlocks);
            }
        }

    let view = {
        type: 'home',
        callback_id: 'home_view',
        title: {
          type: 'plain_text',
          text: 'Keep notes!'
        },
        blocks: blocks
      }
      console.log('JSON.str view-->'+JSON.stringify(view));
      return JSON.stringify(view);
};
const createHome = (res)=> {
    console.log('JSON.sres-->'+JSON.stringify(res));
    const userView =    updateView(res);
    console.log('JSON.str wd-->'+JSON.stringify(userView));
    return userView;

  };
  const openModal = () => {
  
    const modal =   {
        type: "modal",
        title: {
          type: "plain_text",
          text: "Create Account",
          emoji: true
        },
        notify_on_close:true,
        submit: {
          type: "plain_text",
          text: "Submit",
          emoji: true,
        },
        close: {
          type: "plain_text",
          text: "Cancel",
          emoji: true
        },
        blocks: [
          {
            type: "input",
            element: {
              type: "plain_text_input",
              action_id: "plain_text_input-action"
            },
            label: {
              type: "plain_text",
              text: "Name",
              emoji: true
            }
          }
        ],
        callback_id:"modal-callback-id"
      }
    
    return modal;
  };
  
  
module.exports = { createHome,openModal };