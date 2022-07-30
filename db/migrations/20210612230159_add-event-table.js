exports.up = function (knex) {
	return knex.schema.createTable('event', function (table) {
		table.uuid('id').defaultTo(knex.raw('gen_random_uuid()')).primary();
		table.uuid('oddsId').notNullable().references('id').inTable('odds');
		table.string('type').notNullable();
		table.string('homeTeam').notNullable();
		table.string('awayTeam').notNullable();
		table.string('score');
		table.timestamp('startAt').notNullable();
		table.timestamp('createdAt').defaultTo(knex.fn.now());
		table.timestamp('updatedAt').defaultTo(knex.fn.now());
	});
};

exports.down = function (knex) {
	return knex.schema.dropTable('event');
};
