const { db } = require('../../db');

const getAllUsers = () => db.select().table('user');

const getUserById = (id) => db('user').where('id', id).returning('*');

const createUser = (body) => db('user').insert(body).returning('*');

const updateUser = (id, body) =>
	db('user').where('id', id).update(body).returning('*');

module.exports = {
	getAllUsers,
	getUserById,
	createUser,
	updateUser,
};
