const authRouter = require('./auth/auth.api');
const healthRouter = require('./health/health.api');
const transactionRouter = require('./transactions/transactions.api');
const eventsRouter = require('./events/events.api');
const betRouter = require('./bets/bets.api');
const statsRouter = require('./stats/stats.api');

module.exports = {
	authRouter,
	healthRouter,
	transactionRouter,
	eventsRouter,
	betRouter,
	statsRouter,
};
