exports.up = function(knex) {
  return knex.schema.createTable("responses", tbl => {
    tbl.increments();

    tbl
      .integer("reportId", 128)
      .unsigned()
      .notNullable()
      .references("id")
      .inTable("reports")
      .onDelete("CASCADE")
      .onUpdate("CASCADE");

    tbl
      .integer("userId", 128)
      .unsigned()
      .notNullable()
      .references("id")
      .inTable("users")
      .onDelete("CASCADE")
      .onUpdate("CASCADE");

    tbl.text("question").notNullable();

    tbl.text("answer");

    tbl.datetime("submitted_date", { precision: 2 }).notNullable();

    tbl.text("comments");

    tbl.integer("sentimentRange");

    tbl.boolean("isComplete").defaultTo(false);

    tbl.text("managerQuestions").defaultTo("[]");

    tbl.text("managerResponses").defaultTo("[]");
  });
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists("responses");
};
