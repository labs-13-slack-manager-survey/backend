exports.up = function(knex) {
	return knex.schema.createTable('responses', tbl => {
		tbl.increments();

		tbl
			.integer('reportId', 128)
			.unsigned()
			.notNullable()
			.references('id')
			.inTable('reports')
			.onDelete('CASCADE')
			.onUpdate('CASCADE');

		tbl
			.integer('userId', 128)
			.unsigned()
			.notNullable()
			.references('id')
			.inTable('users')
			.onDelete('CASCADE')
			.onUpdate('CASCADE');

		tbl.text('question').notNullable();

		tbl.text('answer');

		tbl.datetime('submitted_date', { precision: 2 }).notNullable();
	});
};

exports.down = function(knex) {
	return knex.schema.dropTableIfExists('responses');
};
