const { ENV } = require('./src/common/enums/enums');

const {
	DB: { ACCESS_KEY, DATABASE, HOST, PORT, USER },
} = ENV;

module.exports = {
	development: {
		client: 'postgresql',
		connection: {
			port: PORT,
			host: HOST,
			database: DATABASE,
			user: USER,
			password: ACCESS_KEY,
		},
		migrations: {
			directory: './db/migrations',
			tableName: 'knex_migrations',
		},
		seeds: {
			directory: './db/seeds',
		},
		pool: {
			min: 0,
			max: 20,
		},
	},
};
