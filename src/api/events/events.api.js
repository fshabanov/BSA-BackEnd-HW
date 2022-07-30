const router = require('express').Router();
const { eventValidation } = require('../../validation');
const { db } = require('../../db');
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
			req.body.odds.home_win = req.body.odds.homeWin;
			delete req.body.odds.homeWin;
			req.body.odds.away_win = req.body.odds.awayWin;
			delete req.body.odds.awayWin;
			oddsService.createOdds(req.body.odds).then(([odds]) => {
				delete req.body.odds;
				req.body.away_team = req.body.awayTeam;
				req.body.home_team = req.body.homeTeam;
				req.body.start_at = req.body.startAt;
				delete req.body.awayTeam;
				delete req.body.homeTeam;
				delete req.body.startAt;
				eventsService
					.createEvent({
						...req.body,
						odds_id: odds.id,
					})
					.then(([event]) => {
						emitterService.statEmitter.emit('newEvent');
						[
							'bet_amount',
							'event_id',
							'away_team',
							'home_team',
							'odds_id',
							'start_at',
							'updated_at',
							'created_at',
						].forEach((whatakey) => {
							var index = whatakey.indexOf('_');
							var newKey = whatakey.replace('_', '');
							newKey = newKey.split('');
							newKey[index] = newKey[index].toUpperCase();
							newKey = newKey.join('');
							event[newKey] = event[whatakey];
							delete event[whatakey];
						});
						['home_win', 'away_win', 'created_at', 'updated_at'].forEach(
							(whatakey) => {
								var index = whatakey.indexOf('_');
								var newKey = whatakey.replace('_', '');
								newKey = newKey.split('');
								newKey[index] = newKey[index].toUpperCase();
								newKey = newKey.join('');
								odds[newKey] = odds[whatakey];
								delete odds[whatakey];
							}
						);
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
									authService.getUserById(bet.user_id).then(([user]) => {
										return authService.updateUser(bet.user_id, {
											balance: user.balance + bet.bet_amount * bet.multiplier,
										});
									});
								} else if (bet.prediction != result) {
									return betService.updateBet(bet.id, {
										win: false,
									});
								}
							})
						);
						setTimeout(() => {
							[
								'bet_amount',
								'event_id',
								'away_team',
								'home_team',
								'odds_id',
								'start_at',
								'updated_at',
								'created_at',
							].forEach((whatakey) => {
								var index = whatakey.indexOf('_');
								var newKey = whatakey.replace('_', '');
								newKey = newKey.split('');
								newKey[index] = newKey[index].toUpperCase();
								newKey = newKey.join('');
								event[newKey] = event[whatakey];
								delete event[whatakey];
							});
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
