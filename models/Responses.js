const db = require("../data/dbconfig");

module.exports = {
  add,
  find,
  findBy,
  findById,
  findDistinctUserCountBy,
  findManagerFeedbackByReportIdAndUserId,
  findManagerFeedbackByReportIdAndUserIdAsMembers,
  update,
  // findSubmissionRatePerMemberBy,
  findByAndJoin,
  findTodays,
  findByUserAndJoin,
  findAvgSentiment
};
// update a response
async function update(id, changes) {
  await db("responses")
    .where({ id })
    .update(changes);
  return findById(id);
}
// find average sentiment of a team's response by the teamId and reportId
async function findAvgSentiment(teamId, reportId) {
  return await db("reports as rep")
    .where("rep.teamId", teamId)
    .join("responses as res", "res.reportId", "=", "rep.id")
    .where("res.reportId", reportId)
    .whereNotNull("res.sentimentRange")
    .avg("res.sentimentRange as average")
    .first();
}
// Create response
async function add(response) {
  const [id] = await db("responses")
    .insert(response)
    .returning("id");

  return findById(id);
}

// Get all responses
function find() {
  return db("responses");
}

// Get responses by filter
function findBy(filter) {
  return db("responses").where(filter);
}
// Get responses of a member by filter
function findDistinctUserCountBy(filter) {
  return db("responses")
    .where(filter)
    .countDistinct("userId")
    .first();
}

// Get submitted report by user and by date
function findTodays(user, reportId, startday, endDay) {
  return db("responses")
    .where("userId", user)
    .where("reportId", reportId)
    .where("submitted_date", ">=", startday)
    .where("submitted_date", "<=", endDay);
}

// Get responses by id
function findById(id) {
  return db("responses")
    .where({ id })
    .first();
}
// Get manager feedback by id
function findManagerFeedbackByReportIdAndUserId(reportId, userId) {
  return db("responses").where({ reportId, userId });
}
// Get manager feedback by id
function findManagerFeedbackByReportIdAndUserIdAsMembers(reportId, userId) {
  return db("responses").where({ reportId, managerId: userId, userId });
}
// This allows us to search by reportId join with users table and return user's name and profile picture.
function findByAndJoin(reportId, startday, endDay) {
  return db("responses")
    .where("reportId", reportId)
    .where("submitted_date", ">=", startday)
    .where("submitted_date", "<=", endDay)
    .whereNot({ question: null, answer: null })
    .join("users", "responses.userId", "users.id")
    .select(
      "users.id as userId",
      "users.fullName",
      "users.profilePic",
      "responses.id",
      "responses.question",
      "responses.answer",
      "responses.submitted_date",
      "responses.sentimentRange"
    )
    .orderBy("responses.submitted_date", "desc");
}

// This allows us to search by reportId and UserId join with users table and return user's name and profile picture.
function findByUserAndJoin(reportId, userId, startday, endDay) {
  return db("responses")
    .where("reportId", reportId)
    .where("userId", userId)
    .where("submitted_date", ">=", startday)
    .where("submitted_date", "<=", endDay)
    .join("users", "responses.userId", "users.id")
    .select(
      "users.id as userId",
      "users.fullName",
      "users.profilePic",
      "responses.id",
      "responses.question",
      "responses.answer",
      "responses.submitted_date"
    )
    .orderBy("responses.submitted_date", "desc");
}
