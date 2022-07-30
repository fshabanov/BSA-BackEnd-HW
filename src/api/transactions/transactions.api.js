const router = require('express').Router();
const { transactionValidation } = require('../../validation');
const { db } = require('../../db');
const { authMiddleware, validatorMiddleware } = require('../../middlewares');

const { validateBody } = validatorMiddleware;

router.post(
	'/',
	authMiddleware.isAdmin,
	validateBody(transactionValidation.createTransaction),
	(req, res, next) => {
		db('user')
			.where('id', req.body.userId)
			.then(([user]) => {
				if (!user) {
					return next({ status: 400, message: 'User does not exist' });
				}
				req.body.card_number = req.body.cardNumber;
				delete req.body.cardNumber;
				req.body.user_id = req.body.userId;
				delete req.body.userId;
				db('transaction')
					.insert(req.body)
					.returning('*')
					.then(([result]) => {
						var currentBalance = req.body.amount + user.balance;
						db('user')
							.where('id', req.body.user_id)
							.update('balance', currentBalance)
							.then(() => {
								['user_id', 'card_number', 'created_at', 'updated_at'].forEach(
									(whatakey) => {
										var index = whatakey.indexOf('_');
										var newKey = whatakey.replace('_', '');
										newKey = newKey.split('');
										newKey[index] = newKey[index].toUpperCase();
										newKey = newKey.join('');
										result[newKey] = result[whatakey];
										delete result[whatakey];
									}
								);
								return res.send({
									...result,
									currentBalance,
								});
							});
					});
			})
			.catch((err) => {
				return next({ status: 500 });
			});
	}
);

module.exports = { router };
