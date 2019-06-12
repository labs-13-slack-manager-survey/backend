const Users = require("../models/Users");
module.exports = {
  getHistoricalSubmissionRate,
  getHistoricalSubmissionRateByReport
};
async function getHistoricalSubmissionRate(teamId) {
  const users = await Users.getPollsStatsByTeamId(teamId);
  const pollsReceived = users.map(user => JSON.parse(user.pollsReceived));
  const responsesMade = users.map(user => JSON.parse(user.responsesMade));
  const rate =
    ([].concat.apply([], responsesMade).reduce((a, c) => a + c) /
      [].concat.apply([], pollsReceived).reduce((a, c) => a + c) || 1) * 100;
  const result = Number.parseFloat(rate).toFixed(2);
  return Number(result);
}

async function getHistoricalSubmissionRateByReport(teamId, reportId) {
  const users = await Users.getPollsStatsByTeamId(teamId, reportId);
  const pollsReceived = users.map(user => JSON.parse(user.pollsReceived));
  const responsesMade = users.map(user => JSON.parse(user.responsesMade));
  const rate =
    ([].concat.apply([], responsesMade).reduce((a, c) => a + c) /
      [].concat.apply([], pollsReceived).reduce((a, c) => a + c) || 1) * 100;
  const result = Number.parseFloat(rate).toFixed(2);
  return Number(result);
}
