const Joi = require('joi');

const createEvent = Joi.object({
	id: Joi.string().uuid(),
	type: Joi.string().required(),
	homeTeam: Joi.string().required(),
	awayTeam: Joi.string().required(),
	startAt: Joi.date().required(),
	odds: Joi.object({
		homeWin: Joi.number().min(1.01).required(),
		awayWin: Joi.number().min(1.01).required(),
		draw: Joi.number().min(1.01).required(),
	}).required(),
}).required();

const updateEvent = Joi.object({
	score: Joi.string().required(),
}).required();

module.exports = {
	createEvent,
	updateEvent,
};
