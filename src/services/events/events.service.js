const { db } = require('../../db');

const getEventById = (id) => db('event').where('id', id);

const createEvent = (body) => db('event').insert(body).returning('*');

const updateEvent = (id, body) =>
	db('event').where('id', id).update(body).returning('*');

module.exports = {
	getEventById,
	createEvent,
	updateEvent,
};
