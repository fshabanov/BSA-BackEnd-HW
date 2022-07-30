const { db } = require('../../db');

const createTransaction = (body) =>
	db('transaction').insert(body).returning('*');

module.exports = {
	createTransaction,
};
