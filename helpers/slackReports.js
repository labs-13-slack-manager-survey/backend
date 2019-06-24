const { button } = require("./slack");
const Users = require("../models/Users");
const { findReportsToBeSent } = require("./filters");
//Setting up the reports to be sent out by slack
const slackReports = async () => {
  try {
    //Get all filtered reports from above function
    const reports = await findReportsToBeSent();
    if (reports.length) {
      //Add users to each report
      const stitchedReports = await Promise.all(
        reports.map(async report => {
          let users = await Users.findMembers(report.teamId);
          console.log(users);
          users.forEach(async user => {
            // make the changes to update the users table with
            const changes = {
              ...user,
              pollsReceived: JSON.stringify([
                ...JSON.parse(user.pollsReceived),
                report.id
              ])
            };
            // Update Users table with the polls being sent out
            await Users.update(user.id, changes);
            return user;
          });
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
    }
    return "The function has successfully ran";
  } catch (error) {
    //sentry call
    throw new Error(error);
  }
};

module.exports = {
  slackReports
};
