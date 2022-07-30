exports.up = function (knex) {
	return knex.schema.createTable('transaction', function (table) {
		table.uuid('id').defaultTo(knex.raw('gen_random_uuid()')).primary();
		table.uuid('userId').notNullable().references('id').inTable('user');
		table.string('cardNumber').notNullable();
		table.float('amount').notNullable();
		table.timestamp('createdAt').defaultTo(knex.fn.now());
		table.timestamp('updatedAt').defaultTo(knex.fn.now());
	});
};

exports.down = function (knex) {
	return knex.schema.dropTable('transaction');
};
