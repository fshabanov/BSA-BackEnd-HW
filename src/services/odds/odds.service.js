const { db } = require('../../db');

const getOddsById = (id) => db('odds').where('id', id);

const createOdds = (body) => db('odds').insert(body).returning('*');

module.exports = {
	getOddsById,
	createOdds,
};
