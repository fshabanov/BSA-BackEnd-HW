exports.up = function (knex) {
	return knex.schema.createTable('odds', function (table) {
		table.uuid('id').defaultTo(knex.raw('gen_random_uuid()')).primary();
		table.float('homeWin').notNullable();
		table.float('draw').notNullable();
		table.float('awayWin').notNullable();
		table.timestamp('createdAt').defaultTo(knex.fn.now());
		table.timestamp('updatedAt').defaultTo(knex.fn.now());
	});
};

exports.down = function (knex) {
	return knex.schema.dropTable('odds');
};
