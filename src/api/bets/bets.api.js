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
const { getMultiplier, getUserIdByToken } = require('../../helpers');

const { validateBody } = validatorMiddleware;

router.post(
	'/',
	authMiddleware.isLoggedIn,
	validateBody(betValidation.createBet),
	async (req, res, next) => {
		let token = req.headers['authorization'];
		const userId = getUserIdByToken(token);
		req.body.userId = userId;
		try {
			const users = await authService.getAllUsers();
			console.log(users, userId);
			const user = users.find((u) => u.id == userId);
			if (!user) {
				return next({ status: 400, message: 'User does not exist' });
			}
			if (+user.balance < +req.body.betAmount) {
				return next({ status: 400, message: 'Not enough balance' });
			}
			const [event] = await eventsService.getEventById(req.body.eventId);
			if (!event) {
				return next({ status: 404, message: 'Event not found' });
			}
			const [odds] = await oddsService.getOddsById(event.oddsId);
			if (!odds) {
				return next({ status: 404, message: 'Odds not found' });
			}
			const multiplier = getMultiplier(req.body.prediction, odds);
			const [bet] = await betService.createBet({
				...req.body,
				multiplier,
				eventId: event.id,
			});
			const currentBalance = user.balance - req.body.betAmount;
			authService.updateUser(userId, { balance: currentBalance }).then(() => {
				services.emitter.statEmitter.emit('newBet');
				return res.send({
					...bet,
					currentBalance,
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
