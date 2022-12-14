const Joi = require('joi');

const createTransaction = Joi.object({
	id: Joi.string().uuid(),
	userId: Joi.string().uuid().required(),
	cardNumber: Joi.string().required(),
	amount: Joi.number().min(0).required(),
}).required();

module.exports = {
	createTransaction,
};
