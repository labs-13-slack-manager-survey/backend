const db = require('../data/dbconfig');

module.exports = {
	add,
	find,
	findBy,
	findById,
	findByAndJoin,
	findTodays,
	findByUserAndJoin
};

// Create response
async function add(response) {
	const [id] = await db('responses')
		.insert(response)
		.returning('id');

	return findById(id);
}

// Get all responses
function find() {
	return db('responses');
}

// Get responses by filter
function findBy(filter) {
	return db('responses').where(filter);
}

// Get submitted report by user and by date
function findTodays(user, reportId, startday, endDay) {
	return db('responses')
		.where('userId', user)
		.where('reportId', reportId)
		.where('submitted_date', '>=', startday)
		.where('submitted_date', '<=', endDay)
}

// Get responses by id
function findById(id) {
	return db('responses')
		.where({ id })
		.first();
}

// This allows us to search by reportId join with users table and return user's name and profile picture.
function findByAndJoin(reportId, startday, endDay) {
	return db('responses')
		.where('reportId', reportId)
		.where('submitted_date', '>=', startday)
		.where('submitted_date', '<=', endDay)
		.join('users', 'responses.userId', 'users.id')
		.select('users.id as userId', 'users.fullName', 'users.profilePic', 'responses.id', 'responses.question', 'responses.answer', 'responses.submitted_date')
		.orderBy('responses.submitted_date', 'desc')
}

// This allows us to search by reportId and UserId join with users table and return user's name and profile picture.
function findByUserAndJoin(reportId, userId, startday, endDay) {
	return db('responses')
		.where('reportId', reportId)
		.where('userId', userId)
		.where('submitted_date', '>=', startday)
		.where('submitted_date', '<=', endDay)
		.join('users', 'responses.userId', 'users.id')
		.select('users.id as userId', 'users.fullName', 'users.profilePic', 'responses.id', 'responses.question', 'responses.answer', 'responses.submitted_date')
		.orderBy('responses.submitted_date', 'desc')
}
