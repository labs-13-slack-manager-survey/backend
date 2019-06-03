exports.up = function(knex) {
	return knex.schema.createTable('reports', tbl => {
		tbl.increments();

		tbl.integer('teamId');

		tbl.string('reportName', 128).notNullable();

		tbl.datetime('created_at', { precision: 2 }).notNullable();

		tbl.text('schedule');

		tbl.time('scheduleTime', { precision: 2 });

		tbl.string('recurring', 128);

		tbl.text('message');

		tbl.datetime('responseTimeLimit', { precision: 2 });

		tbl.text('questions');

		tbl.string('slackChannelName');

		tbl.string('slackChannelId');

		tbl.datetime('nextPublishDate', { precision: 2 });

		tbl
			.boolean('active')
			.defaultTo(true)
			.notNullable();
	});
};

exports.down = function(knex) {
	return knex.schema.dropTableIfExists('reports');
};
