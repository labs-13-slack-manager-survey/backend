const Reports = require("../models/Reports");
const getDay = require("date-fns/get_day");
const getHours = require("date-fns/get_hours");
const getMinutes = require("date-fns/get_minutes");
const { button } = require("./slack");
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
    console.log(stitchedReports);
    //Call the slack button function
    console.log("button not sent");
    const but = await button(stitchedReports);
    console.log("button sent", but);

    return "The function has successfully ran";
  } catch (error) {
    //sentry call
    throw new Error(error);
  }
};

module.exports = {
  slackReports
};
