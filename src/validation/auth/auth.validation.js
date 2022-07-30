const Joi = require('joi');

const getUserById = Joi.object({
	id: Joi.string().uuid(),
}).required();

const createUser = Joi.object({
	id: Joi.string().uuid(),
	type: Joi.string().required(),
	email: Joi.string().email().required(),
	phone: Joi.string()
		.pattern(/^\+?3?8?(0\d{9})$/)
		.required(),
	name: Joi.string().required(),
	city: Joi.string(),
}).required();

const updateUser = Joi.object({
	email: Joi.string().email(),
	phone: Joi.string().pattern(/^\+?3?8?(0\d{9})$/),
	name: Joi.string(),
	city: Joi.string(),
}).required();

module.exports = {
	getUserById,
	createUser,
	updateUser,
};
