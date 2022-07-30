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
	async (req, res) => {
		try {
			var eventId = req.params.id;
			console.log(eventId);
			const bets = await betService.getBetsWithNoWin(eventId);
			var [w1, w2] = req.body.score.split(':');
			const result = +w1 > +w2 ? 'w1' : +w1 < +w2 ? 'w2' : 'x';
			const [event] = await eventsService.updateEvent(eventId, {
				score: req.body.score,
			});
			await Promise.all(
				bets.map(async (bet) => {
					if (bet.prediction == result) {
						betService.updateBet(bet.id, {
							win: true,
						});
						const [user] = await authService.getUserById(bet.userId);
						return authService.updateUser(bet.userId, {
							balance: user.balance + bet.betAmount * bet.multiplier,
						});
					}
					return betService.updateBet(bet.id, {
						win: false,
					});
				})
			);
			res.send(event);
		} catch (err) {
			console.log(err);
			return next({ status: 500 });
		}
	}
);

module.exports = { router };
