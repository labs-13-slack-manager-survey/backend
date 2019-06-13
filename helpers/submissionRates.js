const Users = require("../models/Users");
module.exports = {
  getHistoricalSubmissionRate,
  getHistoricalSubmissionRateByReport
};
async function getHistoricalSubmissionRate(teamId) {
  const users = await Users.getPollsStatsByTeamId(teamId);
  const pollsReceived = users.map(user => JSON.parse(user.pollsReceived));
  const responsesMade = users.map(user => JSON.parse(user.responsesMade));
  const flattenedRes = [].concat.apply([], responsesMade);
  const flattenedPolls = [].concat.apply([], pollsReceived);
  const rate = (flattenedRes.length / flattenedPolls.length || 1) * 100;
  const result = Number.parseFloat(rate).toFixed(2);
  return Number(result);
}

async function getHistoricalSubmissionRateByReport(teamId, reportId) {
  const users = await Users.getPollsStatsByTeamId(teamId, reportId);
  const pollsReceived = users.map(user => JSON.parse(user.pollsReceived));
  const responsesMade = users.map(user => JSON.parse(user.responsesMade));
  const flattenedPolls = [].concat.apply([], responsesMade);
  const flattenedRes = [].concat.apply([], pollsReceived);
  const filteredPolls = flattenedPolls.filter(poll => poll === reportId);
  const filteredRes = flattenedRes.filter(res => res === reportId);
  const rate =
    (filteredRes.reduce((a, c) => a + c) /
      filteredPolls.reduce((a, c) => a + c) || 1) * 100;
  const result = Number.parseFloat(rate).toFixed(2);
  return Number(result);
}
