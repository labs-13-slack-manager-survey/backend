const { searchReports, searchReportsByUser } = require("./searchReports");
const { subDays } = require("date-fns");
const Reports = require("../models/Reports");
const getDay = require("date-fns/get_day");
const getHours = require("date-fns/get_hours");
const getMinutes = require("date-fns/get_minutes");
module.exports = {
  filterByUserAndDate,
  filterByDate,
  filterUserLastSevenDays,
  filterSevenDays,
  filterThirtyDays,
  filterTwoWeeks,
  filterOneDay,
  findReportsToBeSent
};
// required for date-fns
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
async function findReportsToBeSent() {
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
}
// ------- POST /:reportId/filter helpers -------

async function filterByUserAndDate(reportId, userId, date) {
  const batch = {
    date,
    responses: await searchReportsByUser(reportId, userId, date)
  };

  return [batch];
}

async function filterByDate(reportId, date) {
  const batch = {
    date,
    responses: await searchReports(reportId, date)
  };

  return [batch];
}

async function filterUserLastSevenDays(reportId, userId) {
  const date = new Date();

  let payload = [];

  // Loop through the last 7 days and search reports for each day
  for (let i = 0; i < 7; i++) {
    const day = subDays(date, i);
    const batch = {
      date: day,
      responses: await searchReportsByUser(reportId, userId, day)
    };
    payload.push(batch);
  }
  return payload;
}

async function filterSevenDays(reportId, roles) {
  const date = new Date();

  let payload = [];

  // Loop through the last 7 days and search reports for each day
  for (let i = 0; i < 7; i++) {
    const day = subDays(date, i);
    const batch = {
      date: day,
      responses: await searchReports(reportId, day, roles)
    };
    payload.push(batch);
  }
  return payload;
}

async function filterThirtyDays(reportId, roles) {
  const date = new Date();

  let payload = [];

  // Loop through the last 7 days and search reports for each day
  for (let i = 0; i < 30; i++) {
    const day = subDays(date, i);
    const batch = {
      date: day,
      responses: await searchReports(reportId, day, roles)
    };
    payload.push(batch);
  }
  return payload;
}

async function filterTwoWeeks(reportId, roles) {
  const date = new Date();

  let payload = [];

  // Loop through the last 7 days and search reports for each day
  for (let i = 0; i < 14; i++) {
    const day = subDays(date, i);
    const batch = {
      date: day,
      responses: await searchReports(reportId, day, roles)
    };
    payload.push(batch);
  }
  return payload;
}

async function filterOneDay(reportId, roles) {
  const date = new Date();

  let payload = [];

  // Loop through the last 7 days and search reports for each day
  for (let i = 0; i < 1; i++) {
    const day = subDays(date, i);
    const batch = {
      date: day,
      responses: await searchReports(reportId, day, roles)
    };
    payload.push(batch);
  }
  return payload;
}
