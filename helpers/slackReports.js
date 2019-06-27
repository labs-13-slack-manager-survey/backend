const { button } = require("./slack");
const Users = require("../models/Users");
const { findReportsToBeSent } = require("./filters");
//Setting up the reports to be sent out by slack

const sendReports = () => {
  // get the reports to be sent
  let obj = {};
  findReportsToBeSent()
    .then(reports => {
      if (reports.length) {
        reports.map(report => {
          // get the members on each report (of a team)
          Users.findMembers(report.teamId).then(members => {
            //  loop over each member
            members.map(member => {
              obj[member.id]
                ? obj[member.id].push(report.id)
                : (obj[member.id] = [
                    ...JSON.parse(member.pollsReceived),
                    report.id
                  ]);
            });
            for (key in obj) {
              Users.update(key, {
                pollsReceived: JSON.stringify([...obj[key]])
              });
            }
          });
        });
      }
    })
    .catch(err => console.log(err));
  return;
};
const slackReports = async () => {
  try {
    //Get all filtered reports from above function
    const reports = await findReportsToBeSent();
    // console.log(reports);
    if (reports.length) {
      //Add users to each report
      const stitchedReports = await Promise.all(
        reports.map(async report => {
          let users = await Users.findMembers(report.teamId);
          // gets all the active slack members on a team
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
    }
    return "The function has successfully ran";
  } catch (error) {
    //sentry call
    throw new Error(error);
  }
};

module.exports = {
  slackReports,
  sendReports
};
