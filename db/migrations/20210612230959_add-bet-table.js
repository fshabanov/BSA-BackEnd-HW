exports.up = function (knex) {
	return knex.schema.createTable('bet', function (table) {
		table.uuid('id').defaultTo(knex.raw('gen_random_uuid()')).primary();
		table.uuid('eventId').notNullable().references('id').inTable('event');
		table.uuid('userId').notNullable().references('id').inTable('user');
		table.float('betAmount').notNullable();
		table.string('prediction').notNullable();
		table.float('multiplier').notNullable();
		table.boolean('win');
		table.timestamp('createdAt').defaultTo(knex.fn.now());
		table.timestamp('updatedAt').defaultTo(knex.fn.now());
	});
};

exports.down = function (knex) {
	return knex.schema.dropTable('bet');
};
