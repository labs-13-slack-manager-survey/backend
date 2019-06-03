exports.up = function(knex) {
	return knex.schema.createTable('users', tbl => {
		tbl.increments();

		tbl.integer('teamId');

		tbl
			.string('email', 128)
			.notNullable()
			.unique();

		tbl.string('password', 128);

		tbl.string('fullName', 128);

		tbl.string('roles').notNullable();

		tbl.string('profilePic');

		tbl.datetime('created_at', { precision: 2 }).notNullable();

		tbl.string('timezone').notNullable();

		tbl.string('joinCode');

		tbl
			.boolean('active')
			.defaultTo(true)
			.notNullable();

		tbl.text('slackToken').unique();

		tbl.string('slackUserId');

		tbl.string('slackTeamId');
	});
};

exports.down = function(knex) {
	return knex.schema.dropTableIfExists('users');
};
