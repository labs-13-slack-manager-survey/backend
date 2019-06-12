const db = require("../data/dbconfig");

module.exports = {
  add,
  find,
  findBy,
  findByRole,
  findByJoinCode,
  findById,
  findBySlackId,
  findByTeam,
  findByEmail,
  findManager,
  findMembers,
  findMembersCount,
  getPollsStatsByTeamId,
  getPollsStatsByTeamIdAndReportId,
  update,
  updateTeamId,
  remove
};

// Create User
async function add(user) {
  const [id] = await db("users")
    .insert(user)
    .returning("id");

  return findById(id);
}
function getPollsStatsByTeamIdAndReportId(teamId, reportId) {
  return db("users as u")
    .join("reports as r", "u.teamId", "=", "r.teamId")
    .where({ "u.teamId": teamId, "r.id": reportId })
    .select("u.id", "u.pollsReceived", "u.responsesMade");
}
function getPollsStatsByTeamId(teamId) {
  return db("users")
    .where({ teamId })
    .select("id", "pollsReceived", "responsesMade");
}
// Get all users
function find() {
  return db("users");
}

// Get user by id
function findById(id) {
  return db("users")
    .where({ id })
    .first();
}

// Get user by email

function findByEmail(email) {
  return db("users").where({ email });
}

// Get user by filter
function findBy(filter) {
  return db("users").where(filter);
}

// Get user by slack Id
async function findBySlackId(slackUserId) {
  const response = await db("users")
    .where({ slackUserId })
    .first();
  return response;
}

// Get user by role
async function findByRole(roles) {
  const users = await db("users").where({ roles });
  return users;
}

// Get user by joinCode
async function findByJoinCode(joinCode) {
  const { teamId } = await db("users")
    .where({ joinCode })
    .first();
  return teamId;
}

// Get user by team id
async function findByTeam(teamId) {
  const users = await db("users").where({ teamId });
  return users;
}
// Get manager by team Id
async function findManager(teamId) {
  const manager = await db("users")
    .where({ teamId, roles: "admin" })
    .first();
  return manager;
}
// Get members by team Id
async function findMembers(teamId) {
  const members = await db("users").where({ teamId, roles: "member" });
  return members;
}
// Get number of members by team ID
async function findMembersCount(teamId) {
  const members = await db("users")
    .where({ teamId, roles: "member" })
    .count("id")
    .first();
  return members;
}
// Update user
async function update(id, user) {
  const editedUser = await db("users")
    .where({ id })
    .update(user);
  return findById(id);
}
// Update TeamId
async function updateTeamId(id, user) {
  const editedUser = await db("users")
    .where({ id })
    .update(user);
  return findById(id);
}

// Delete user
function remove(id) {
  return db("users")
    .where({ id })
    .del();
}
