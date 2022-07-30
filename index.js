var express = require('express');

const routes = require('./src/api');

const { initDb } = require('./src/db');
const services = require('./src/services');
const data = require('./src/data');
var app = express();

var port = 3000;

app.use(express.json());
app.use(initDb);

app.use('/users', routes.authRouter.router);
app.use('/health', routes.healthRouter.router);
app.use('/transactions', routes.transactionRouter.router);
app.use('/events', routes.eventsRouter.router);
app.use('/bets', routes.betRouter.router);
app.use('/stats', routes.statsRouter.router);

app.use((err, req, res, next) => {
	const { status, message } = err;
	if (status === 500) {
		res.status(500).send('Internal Server Error');
	} else {
		res.status(status).send({ error: message });
	}
});

app.listen(port, () => {
	services.emitter.statEmitter.on('newUser', () => {
		data.statsData.stats.totalUsers++;
	});
	services.emitter.statEmitter.on('newBet', () => {
		data.statsData.stats.totalBets++;
	});
	services.emitter.statEmitter.on('newEvent', () => {
		data.statsData.stats.totalEvents++;
	});

	console.log(`App listening at http://localhost:${port}`);
});

// Do not change this line
module.exports = { app };
