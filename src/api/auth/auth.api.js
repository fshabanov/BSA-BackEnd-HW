const router = require('express').Router();
const { db } = require('../../db');
const { authValidation } = require('../../validation');
const services = require('../../services');
const jwt = require('jsonwebtoken');
const { authMiddleware, validatorMiddleware } = require('../../middlewares');

const { validateBody, validateParams } = validatorMiddleware;

router.get(
	'/:id',
	validateParams(authValidation.getUserById),
	(req, res, next) => {
		try {
			db('user')
				.where('id', req.params.id)
				.returning('*')
				.then(([result]) => {
					if (!result) {
						return next({ status: 404, message: 'User not found' });
					}
					return res.send({
						...result,
					});
				});
		} catch (err) {
			console.log(err);
			return next({ status: 500 });
		}
	}
);

router.post('/', validateBody(authValidation.createUser), (req, res, next) => {
	req.body.balance = 0;
	db('user')
		.insert(req.body)
		.returning('*')
		.then(([result]) => {
			result.createdAt = result.created_at;
			delete result.created_at;
			result.updatedAt = result.updated_at;
			delete result.updated_at;
			services.emitter.statEmitter.emit('newUser');
			return res.send({
				...result,
				accessToken: jwt.sign(
					{ id: result.id, type: result.type },
					process.env.JWT_SECRET
				),
			});
		})
		.catch((err) => {
			console.log(err);
			if (err.code == '23505') {
				return next({
					status: 400,
					message: err.detail,
				});
			}
			return next({ status: 500 });
		});
});

router.put(
	'/:id',
	authMiddleware.isLoggedIn,
	validateBody(authValidation.updateUser),
	(req, res, next) => {
		let token = req.headers['authorization'];
		token = token.replace('Bearer ', '');
		const tokenPayload = jwt.verify(token, process.env.JWT_SECRET);
		if (req.params.id !== tokenPayload.id) {
			return next({ status: 401, message: 'UserId mismatch' });
		}
		db('user')
			.where('id', req.params.id)
			.update(req.body)
			.returning('*')
			.then(([result]) => {
				return res.send({
					...result,
				});
			})
			.catch((err) => {
				if (err.code == '23505') {
					console.log(err);
					return next({ status: 400, message: err.detail });
				}
				console.log(err);
				return next({ status: 500 });
			});
	}
);

module.exports = {
	router,
};