const emitter = require('./statEmitter/emitter.service');
const auth = require('./auth/auth.service');
const bet = require('./bet/bet.service');
const events = require('./events/events.service');
const odds = require('./odds/odds.service');
const transactions = require('./transactions/transactions.service');

module.exports = {
	emitter,
	auth,
	bet,
	events,
	odds,
	transactions,
};
