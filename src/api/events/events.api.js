const router = require('express').Router();
const { eventValidation } = require('../../validation');
const {
	emitter: emitterService,
	events: eventsService,
	odds: oddsService,
	auth: authService,
	bet: betService,
} = require('../../services');
const { authMiddleware, validatorMiddleware } = require('../../middlewares');
const { validateBody } = validatorMiddleware;

router.post(
	'/',
	authMiddleware.isAdmin,
	validateBody(eventValidation.createEvent),
	(req, res, next) => {
		try {
			oddsService.createOdds(req.body.odds).then(([odds]) => {
				delete req.body.odds;
				eventsService
					.createEvent({
						...req.body,
						oddsId: odds.id,
					})
					.then(([event]) => {
						emitterService.statEmitter.emit('newEvent');
						return res.send({
							...event,
							odds,
						});
					});
			});
		} catch (err) {
			console.log(err);
			return next({ status: 500 });
		}
	}
);

router.put(
	'/:id',
	authMiddleware.isAdmin,
	validateBody(eventValidation.updateEvent),
	(req, res) => {
		try {
			var eventId = req.params.id;
			console.log(eventId);
			betService.getBetsWithNoWin(eventId).then((bets) => {
				var [w1, w2] = req.body.score.split(':');
				let result;
				if (+w1 > +w2) {
					result = 'w1';
				} else if (+w2 > +w1) {
					result = 'w2';
				} else {
					result = 'x';
				}
				eventsService
					.updateEvent(eventId, { score: req.body.score })
					.then(([event]) => {
						Promise.all(
							bets.map((bet) => {
								if (bet.prediction == result) {
									betService.updateBet(bet.id, {
										win: true,
									});
									authService.getUserById(bet.userId).then(([user]) => {
										return authService.updateUser(bet.userId, {
											balance: user.balance + bet.betAmount * bet.multiplier,
										});
									});
								} else if (bet.prediction != result) {
									return betService.updateBet(bet.id, {
										win: false,
									});
								}
							})
						).then(() => {});
						setTimeout(() => {
							res.send(event);
						}, 1000);
					});
			});
		} catch (err) {
			console.log(err);
			return next({ status: 500 });
		}
	}
);

module.exports = { router };
