const url = "https://slack.com/api/im.open";
const postUrl = "https://slack.com/api/chat.postMessage";
const headers = {
  "Content-type": "application/json; charset=utf-8",
  Authorization: `Bearer ${process.env.SLACK_ACCESS_TOKEN}`
};
const axios = require("axios");

//Steps for sending out reports

// Array of reports to be sent out
// Loop over reports array, for each report find all users
// Slack - For each user send out button
// Web - for each user send out email

// this component is the message we send to slack with a respond button
// ex. Hi, Ben :wave: Please fill out your report!    Respond
//
const button = async reports => {
  try {
    reports.map(async report => {
      report.users.map(async user => {
        // console.log("report here", report);
        let response = null;
        let result = "";
        let managerQuestions = JSON.parse(report.managerQuestions);
        let managerResponses = JSON.parse(report.managerResponses);
        let sentimentQuestions = JSON.parse(report.sentimentQuestions);
        let sentimentQuestionsBlock = sentimentQuestions
          ? {
              type: "section",
              text: {
                type: "mrkdwn",
                text: sentimentQuestions[0]
              },
              accessory: {
                type: "static_select",
                placeholder: {
                  type: "plain_text",
                  text: "From 1-5",
                  emoji: true
                },
                options: [
                  {
                    text: {
                      type: "plain_text",
                      text: "1",
                      emoji: true
                    },
                    value: "value-0"
                  },
                  {
                    text: {
                      type: "plain_text",
                      text: "2",
                      emoji: true
                    },
                    value: "value-1"
                  },
                  {
                    text: {
                      type: "plain_text",
                      text: "3",
                      emoji: true
                    },
                    value: "value-2"
                  },
                  {
                    text: {
                      type: "plain_text",
                      text: "4",
                      emoji: true
                    },
                    value: "value-2"
                  },
                  {
                    text: {
                      type: "plain_text",
                      text: "5",
                      emoji: true
                    },
                    value: "value-2"
                  }
                ]
              }
            }
          : null;
        try {
          // combine manager questions with responses to send into slack
          const message = {
            user: user.slackUserId,
            include_locale: true,
            return_im: true
          };
          const { data } = await axios.post(url, message, { headers });
          if (managerResponses) {
            const combinedArr = combine(managerQuestions, managerResponses);
            result = combinedArr.join("");
            response = {
              // the response is the message that's being sent to slack.
              channel: data.channel.id,
              attachments: [
                {
                  blocks: [
                    {
                      type: "section",
                      text: {
                        type: "mrkdwn",
                        text: `Hi ${user.fullName} :wave:`
                      }
                    },
                    {
                      type: "section",
                      text: {
                        type: "mrkdwn",
                        text: `Here is your manager's Goal for the week!`
                      }
                    },
                    {
                      type: "divider"
                    },
                    {
                      type: "section",
                      text: {
                        type: "mrkdwn",
                        text: result
                      }
                    },
                    {
                      type: "divider"
                    },
                    {
                      type: "section",
                      text: {
                        type: "mrkdwn",
                        text: `Please fill out your report: ${
                          report.reportName
                        }`
                      },
                      accessory: {
                        type: "button",
                        text: {
                          type: "plain_text",
                          text: "Respond",
                          emoji: true
                        },
                        value: JSON.stringify(report)
                      }
                    },
                    sentimentQuestionsBlock
                  ]
                }
              ]
            };
          }
          if (!managerQuestions) {
            response = {
              // the response is the message that's being sent to slack.
              channel: data.channel.id,
              attachments: [
                {
                  blocks: [
                    {
                      type: "section",
                      text: {
                        type: "mrkdwn",
                        text: `Hi ${user.fullName} :wave:`
                      }
                    },
                    {
                      type: "divider"
                    },
                    {
                      type: "section",
                      text: {
                        type: "mrkdwn",
                        text: `Please fill out your report: ${
                          report.reportName
                        }`
                      },
                      accessory: {
                        type: "button",
                        text: {
                          type: "plain_text",
                          text: "Respond",
                          emoji: true
                        },
                        value: JSON.stringify(report)
                      }
                    },
                    sentimentQuestionsBlock
                  ]
                }
              ]
            };
          }
        } catch (err) {
          throw new Error("please include managers responses");
        }
        const responseMessage = await axios.post(postUrl, response, {
          headers
        });
      });
    });
  } catch (err) {
    //sentry call
    throw new Error(err);
  }
};

function combine(arr1, arr2) {
  let result = [];
  for (let i = 0; i < arr1.length; i++) {
    if (arr2[i].length) {
      result.push("*");
      result.push(arr1[i]);
      result.push("*");
      result.push("\n");
      result.push(arr2[i]);
      result.push("\n");
    }
  }
  return result;
}

module.exports = {
  button
};
