
const app = require('./app');
const jsforce = require('jsforce');
const e = require('express');
const updateView = (res,selectedValue) => {
    let blocks = [ 
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: "*Welcome!* \nThis is a home for EPAM POC. Please select drop down from the menu to see more options!"
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
        },
        {
          "type": "section",
          "text": {
            "type": "plain_text",
            "text": "Select Menu"
          },
          "accessory": {
            "type": "static_select",
            "action_id": "static_select-action",
            "type": "static_select",
            "placeholder": {
              "type": "plain_text",
              "text": "Select an item",
              "emoji": true
            },
            "options": [
              {
                "text": {
                  "type": "plain_text",
                  "text": "Account",
                  "emoji": true
                },
                "value": "Account"
              },
              {
                "text": {
                  "type": "plain_text",
                  "text": "Contact",
                  "emoji": true
                },
                "value": "Contact"
              },
              {
                "text": {
                  "type": "plain_text",
                  "text": "My Approvals",
                  "emoji": true
                },
                "value": "Approval"
              },
              {
                "text": {
                  "type": "plain_text",
                  "text": "My Requests",
                  "emoji": true
                },
                "value": "Requested"
              }
            ],
          }
        },
        {
          "type": "divider"
        }
      ];
        if(res !== undefined)
        { 
          if(selectedValue === 'Account')
          {
                let noteBlocks = [];
                for (const o of res) {
                    noteBlocks = [
                      {
                        type: "divider"
                      },
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
          if(selectedValue === 'Contact')
          {
                let noteBlocks = [];
                for (const o of res) {
                    noteBlocks = [
                        {
                          type: "section",
                          text: {
                            type: "mrkdwn",
                            text: o.Name
                          }
                        },
                        {
                          "type": "context",
                          "elements": [
                            {
                              "type": "mrkdwn",
                              "text": o.Email ? o.Email : 'sample@email.com'
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
          if(selectedValue === 'Approval')
          {
            let i = 0;
                let noteBlocks = [];
                noteBlocks = [
                  {
                    type: "section",
                      text: {
                        type: "mrkdwn",
                        text: "*Records waiting for Your Approval*"
                    }
                  },
                  {
                    type: "divider"
                  }
                ];
                for (const o of res) {

                  let  innnoteBlocks = [
                        {
                          type: "context",
                          elements: [
                            {
                              type: "mrkdwn",
                              text: "Submitted by"
                            },
                            {
                              type: "image",
                              image_url: "https://api.slack.com/img/blocks/bkb_template_images/profile_3.png",
                              alt_text: "Dwight Schrute"
                            },
                            {
                              type: "mrkdwn",
                              text: "*"+o.wName+"*"
                            }
                          ]
                        },
                        {
                          type: "section",
                          text: {
                            type: "mrkdwn",
                            text: "*"+o.wName+"*" +   "\nElapsed Time:" + "*" + o.ElapsedTimeInDays +"*"+ "\nStatus:" + "*" +o.status + "*"
                          }
                        },
                        {
                          type: "actions",
                          elements: [
                            {
                              type: "button",
                              text: {
                                type: "plain_text",
                                text: "Approve",
                                emoji: true
                              },
                              style: "primary",
                              value: o.wId,
                              action_id: "approve-request"
                            },
                            {
                              type: "button",
                              text: {
                                type: "plain_text",
                                text: "Decline",
                                emoji: true
                              },
                              style: "danger",
                              value: o.wId,
                              action_id: "reject-request"
                            },
                          ]
                        },
                        {
                          type: "divider"
                        }
                      ];
                      noteBlocks = noteBlocks.concat(innnoteBlocks);
                }
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
     // console.log('JSON.str view-->'+JSON.stringify(view));
      return JSON.stringify(view);
};
const createHome = (res,selectedValue)=> {
  //  console.log('JSON.sres-->'+JSON.stringify(res));
    const userView =    updateView(res,selectedValue);
   // console.log('JSON.str wd-->'+JSON.stringify(userView));
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