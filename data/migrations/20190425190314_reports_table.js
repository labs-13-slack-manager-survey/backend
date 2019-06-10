exports.up = function(knex) {
  return knex.schema.createTable("reports", tbl => {
    tbl.increments();

    tbl.integer("teamId");

    tbl.string("reportName", 128).notNullable();

    tbl.datetime("created_at", { precision: 2 }).notNullable();

    tbl.text("schedule");

    tbl.time("scheduleTime", { precision: 2 });
// message is not really required.should be taken out
    tbl.text("message");

    tbl.text("questions");

    tbl.string("slackChannelName");

    tbl.string("slackChannelId");

    
    tbl.boolean("isSentiment").defaultTo("false");
    tbl
      .boolean("active")
      .defaultTo(true)
      .notNullable();

    tbl.text("EngineeringManagerQuestions")

    tbl.text("ScrumMasterQuestions")

      tbl.text("managerResponse")
  });
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists("reports");
};
