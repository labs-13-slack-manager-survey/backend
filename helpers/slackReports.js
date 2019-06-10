const Reports = require("../models/Reports");
const getDay = require("date-fns/get_day");
const getHours = require("date-fns/get_hours");
const getMinutes = require("date-fns/get_minutes");
const axios = require("axios");

const Users = require("../models/Users");

const daysToNumbers = {
  0: "Sunday",
  1: "Monday",
  2: "Tuesday",
  3: "Wednesday",
  4: "Thursday",
  5: "Friday",
  6: "Saturday"
};

//Get and filter all reports going out at this time
const filterReports = async () => {
  //Get current date and the day of the week
  let currentDate = new Date();
  const dayOfWeek = daysToNumbers[getDay(currentDate)];

  //Get all reports
  const reports = await Reports.find();

  //Filter all reports to see if it is ready to be sent out
  return reports.filter(report => {
    //Get hours and mins and turn them into integers
    let hours = getHours(`2000-01-01T${report.scheduleTime}`);
    let minutes = getMinutes(`2000-01-01T${report.scheduleTime}`);

    //Get current hour and minutes from the current date
    const currentHour = getHours(currentDate);
    const currentMin = getMinutes(currentDate);
    //Check to see if the current hour/min matches the hour/min of the report
    const sameHours = hours == currentHour ? true : true;
    const sameMin = minutes == currentMin ? true : true;

    // Check to see if all checks match true
    return (
      report.schedule.includes(dayOfWeek) &&
      report.active &&
      sameHours &&
      sameMin
    );
  });
};

//Setting up the reports to be sent out by slack
const slackReports = async () => {
  try {
    //Get all filtered reports from above function
    const reports = await filterReports();

    //Add users to each report
    const stitchedReports = await Promise.all(
      reports.map(async report => {
        let users = await Users.findByTeam(report.teamId);
        // getse all the users in a team
        // let members = await Users.findMembers(report.teamId); use this line instead to find only members and not managers
        const filteredUsers = users.filter(
          user => user.slackUserId && user.active
        );

        const newReport = {
          ...report,
          users: filteredUsers
        };
        return newReport;
      })
    );
    //Call the slack button function
    await button(stitchedReports);
    return "The function has successfully ran";
  } catch (error) {
    //sentry call
    throw new Error(error);
  }
};

module.exports = {
  slackReports
};

//Steps for sending out reports

// Array of reports to be sent out
// Loop over reports array, for each report find all users
// Slack - For each user send out button
// Web - for each user send out email

const url = "https://slack.com/api/im.open";
const postUrl = "https://slack.com/api/chat.postMessage";
const headers = {
  "Content-type": "application/json; charset=utf-8",
  Authorization: `Bearer ${process.env.SLACK_ACCESS_TOKEN}`
};

const button = async reports => {
  try {
    reports.map(async report => {
      report.users.map(async user => {
        const message = {
          user: user.slackUserId,
          include_locale: true,
          return_im: true
        };
        console.log("report", report);
        const { data } = await axios.post(url, message, { headers });
        // used to get the id of the channel
        const response = {
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
                    text: `Please fill out your report: ${report.reportName}`
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
                }
              ]
            }
          ]
        };
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
