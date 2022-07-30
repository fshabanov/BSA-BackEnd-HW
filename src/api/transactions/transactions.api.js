const router = require('express').Router();
const { transactionValidation } = require('../../validation');
const { authMiddleware, validatorMiddleware } = require('../../middlewares');
const {
	auth: authService,
	transactions: transactionsService,
} = require('../../services');

const { validateBody } = validatorMiddleware;

router.post(
	'/',
	authMiddleware.isAdmin,
	validateBody(transactionValidation.createTransaction),
	(req, res, next) => {
		authService
			.getUserById(req.body.userId)
			.then(([user]) => {
				if (!user) {
					return next({ status: 400, message: 'User does not exist' });
				}
				transactionsService.createTransaction(req.body).then(([result]) => {
					var currentBalance = req.body.amount + user.balance;
					authService
						.updateUser(req.body.userId, { balance: currentBalance })
						.then(() => {
							return res.send({
								...result,
								currentBalance,
							});
						});
				});
			})
			.catch((err) => {
				console.log(err);
				return next({ status: 500 });
			});
	}
);

module.exports = { router };
