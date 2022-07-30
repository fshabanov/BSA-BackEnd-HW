const { db } = require('../../db');

const getBetsWithNoWin = (eventId) =>
	db('bet').where('event_id', eventId).andWhere('win', null);

const createBet = (body) => db('bet').insert(body).returning('*');

const updateBet = (id, body) => db('bet').where('id', id).update(body);

module.exports = {
	getBetsWithNoWin,
	createBet,
	updateBet,
};
