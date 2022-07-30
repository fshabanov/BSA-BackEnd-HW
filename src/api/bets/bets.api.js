const router = require('express').Router();
const { betValidation } = require('../../validation');
const jwt = require('jsonwebtoken');
const { authMiddleware, validatorMiddleware } = require('../../middlewares');
const {
	auth: authService,
	bet: betService,
	events: eventsService,
	odds: oddsService,
} = require('../../services');

const { validateBody } = validatorMiddleware;

router.post(
	'/',
	authMiddleware.isLoggedIn,
	validateBody(betValidation.createBet),
	(req, res, next) => {
		let token = req.headers['authorization'];
		token = token.replace('Bearer ', '');
		const tokenPayload = jwt.verify(token, process.env.JWT_SECRET);
		const userId = tokenPayload.id;
		try {
			req.body.userId = userId;
			authService.getAllUsers().then((users) => {
				var user = users.find((u) => u.id == userId);
				if (!user) {
					return next({ status: 400, message: 'User does not exist' });
				}
				if (+user.balance < +req.body.betAmount) {
					return next({ status: 400, message: 'Not enough balance' });
				}
				eventsService.getEventById(req.body.eventId).then(([event]) => {
					if (!event) {
						return next({ status: 404, message: 'Event not found' });
					}
					oddsService.getOddsById(event.oddsId).then(([odds]) => {
						if (!odds) {
							return next({ status: 404, message: 'Odds not found' });
						}
						let multiplier;
						switch (req.body.prediction) {
							case 'w1':
								multiplier = odds.homeWin;
								break;
							case 'w2':
								multiplier = odds.awayWin;
								break;
							case 'x':
								multiplier = odds.draw;
								break;
						}
						betService
							.createBet({
								...req.body,
								multiplier,
								eventId: event.id,
							})
							.then(([bet]) => {
								var currentBalance = user.balance - req.body.betAmount;
								authService
									.updateUser(userId, { balance: currentBalance })
									.then(() => {
										services.emitter.statEmitter.emit('newBet');
										return res.send({
											...bet,
											currentBalance: currentBalance,
										});
									});
							});
					});
				});
			});
		} catch (err) {
			console.log(err);
			return next({ status: 500 });
		}
	}
);

module.exports = {
	router,
};
