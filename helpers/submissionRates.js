const Users = require("../models/Users");
module.exports = {
  getHistoricalSubmissionRate,
  getHistoricalSubmissionRateByReport
};
async function getHistoricalSubmissionRate(teamId) {
  const users = await Users.getPollsStatsByTeamId(teamId);
  // grab polls and responses  received , array of arrays
  const pollsReceived = users.map(user => JSON.parse(user.pollsReceived));
  const responsesMade = users.map(user => JSON.parse(user.responsesMade));
  // flatten the array so we can count it
  const flattenedRes = [].concat.apply([], responsesMade);
  const flattenedPolls = [].concat.apply([], pollsReceived);
  // calculate the rate
  const rate = (flattenedRes.length / (flattenedPolls.length || 1)) * 100;
  const result = Number.parseFloat(rate).toFixed(2);
  return Number(result);
}

async function getHistoricalSubmissionRateByReport(teamId, reportId) {
  const users = await Users.getPollsStatsByTeamId(teamId, reportId);
  // grab polls and responses received, array of arrays
  const pollsReceived = users.map(user => JSON.parse(user.pollsReceived));
  const responsesMade = users.map(user => JSON.parse(user.responsesMade));
  // flatten the array so we can count it
  const flattenedRes = [].concat.apply([], responsesMade);
  const flattenedPolls = [].concat.apply([], pollsReceived);
  // filter through the array to find the one matching the report id

  const filteredPolls = flattenedPolls.filter(
    poll => poll === Number(reportId)
  );
  const filteredRes = flattenedRes.filter(res => res === Number(reportId));
  // calculate the rate
  const rate = (filteredRes.length / (filteredPolls.length || 1)) * 100;

  const result = Number.parseFloat(rate).toFixed(2);
  return Number(result);
}
