var knex = require('knex');
var dbConfig = require('../../knexfile');

var db = knex(dbConfig.development);

const initDb = (_req, _res, next) => {
	db = knex(dbConfig.development);
	db.raw('select 1+1 as result')
		.then(function () {
			next();
		})
		.catch(() => {
			throw new Error('No db connection');
		});
};
module.exports = {
	db,
	initDb,
};
