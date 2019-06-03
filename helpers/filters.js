const { searchReports, searchReportsByUser } = require('./searchReports');
const { subDays } = require('date-fns');

module.exports = {
  filterByUserAndDate,
  filterByDate,
  filterUserLastSevenDays,
  filterSevenDays
}


// ------- POST /:reportId/filter helpers -------

async function filterByUserAndDate(reportId, userId, date) {
	const batch = {
		date,
		responses: await searchReportsByUser(reportId, userId, date)
	};

	return [batch]
}

async function filterByDate(reportId, date) {
	const batch = {
		date,
		responses: await searchReports(reportId, date)
	};

	return [batch]
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

async function filterSevenDays(reportId) {
	const date = new Date();

	let payload = [];

	// Loop through the last 7 days and search reports for each day
	for (let i = 0; i < 7; i++) {
		const day = subDays(date, i);
		const batch = {
			date: day,
			responses: await searchReports(reportId, day)
		};
		payload.push(batch);
	}
	return payload;
}