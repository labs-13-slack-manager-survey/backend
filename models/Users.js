const db = require('../data/dbconfig');

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
	update,
	updateTeamId,
	remove
};

// Create User
async function add(user) {
	const [id] = await db('users')
		.insert(user)
		.returning('id');

	return findById(id);
}

// Get all users
function find() {
	return db('users');
}

// Get user by id
function findById(id) {
	return db('users')
		.where({ id })
		.first();
}

// Get user by email

function findByEmail(email) {
	return db('users').where({ email });
}

// Get user by filter
function findBy(filter) {
	return db('users').where(filter);
}

// Get user by slack Id
async function findBySlackId(slackUserId) {
	const response = await db('users')
		.where({ slackUserId })
		.first();
	return response;
}

// Get user by role
async function findByRole(roles) {
	const users = await db('users').where({ roles });
	return users;
}

// Get user by joinCode
async function findByJoinCode(joinCode) {
	const { teamId } = await db('users')
		.where({ joinCode })
		.first();
	return teamId;
}

// Get user by team id
async function findByTeam(teamId) {
	const users = await db('users').where({ teamId });
	return users;
}

// Update user
async function update(id, user) {
	console.log(id, user)
	const editedUser = await db('users')
		.where({ id })
		.update(user);
	console.log('editedUser', editedUser)
	return findById(id);
}

async function updateTeamId(id, user) {
	console.log(id, user)
	const editedUser = await db('users')
		.where({ id })
		.update(user);
	console.log('editedUser', editedUser)
	return findById(id);
}


// Delete user
function remove(id) {
	return db('users')
		.where({ id })
		.del();
}
