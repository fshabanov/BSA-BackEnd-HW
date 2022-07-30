const authValidation = require('./auth/auth.validation');
const transactionValidation = require('./transactions/transations.validation');
const eventValidation = require('./events/events.validation');
const betValidation = require('./bets/bets.validation');

module.exports = {
	authValidation,
	transactionValidation,
	eventValidation,
	betValidation,
};
