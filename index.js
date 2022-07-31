const express = require('express');
// logger
const morgan = require('morgan');

const routes = require('./src/api');

const { initDb, db } = require('./src/db');
const { emitter: emitterService } = require('./src/services');
const data = require('./src/data');

const app = express();

app.use(
  morgan(
    'METHOD - :method; URL - :url; STATUS - :status; RESPONSE TIME - :response-time ms'
  )
);

const port = 3000;

app.use(express.json());
app.use(initDb);

app.use('/users', routes.authRouter.router);
app.use('/health', routes.healthRouter.router);
app.use('/transactions', routes.transactionRouter.router);
app.use('/events', routes.eventsRouter.router);
app.use('/bets', routes.betRouter.router);
app.use('/stats', routes.statsRouter.router);

app.use((err, _req, res, _next) => {
  const { status, message } = err;
  if (status === 500) {
    res.status(500).send('Internal Server Error');
  } else {
    res.status(status || 400).send({ error: message });
  }
});

const server = app.listen(port, () => {
  emitterService.onNewUser(() => {
    data.statsData.stats.totalUsers++;
  });
  emitterService.onNewBet(() => {
    data.statsData.stats.totalBets++;
  });
  emitterService.onNewEvent(() => {
    data.statsData.stats.totalEvents++;
  });

  console.log(`App listening at http://localhost:${port}`);
});

process.on('SIGTERM', () => {
  // Closing HTTP server
  server.close(() => {
    // HTTP server closed
    db.destroy();
    process.exit(0);
  });
});

// Do not change this line
module.exports = { app };
