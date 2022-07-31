const router = require('express').Router();
const { authValidation } = require('../../validation');
const {
	emitter: emitterService,
	auth: authService,
} = require('../../services');
const jwt = require('jsonwebtoken');
const { authMiddleware, validatorMiddleware } = require('../../middlewares');
const { getUserIdByToken } = require('../../helpers');

const { ENV } = require('../../common/enums/enums');

const {
	JWT: { SECRET },
} = ENV;

const { validateBody, validateParams } = validatorMiddleware;

router.get(
	'/:id',
	validateParams(authValidation.getUserById),
	async (req, res, next) => {
		try {
			const [result] = await authService.getUserById(req.params.id);
			if (!result) {
				return next({ status: 404, message: 'User not found' });
			}
			return res.send({
				...result,
			});
		} catch (err) {
			console.log(err);
			return next({ status: 500 });
		}
	}
);

router.post(
	'/',
	validateBody(authValidation.createUser),
	async (req, res, next) => {
		try {
			const [result] = await authService.createUser(req.body);
			emitterService.emitNewUser();
			return res.send({
				...result,
				accessToken: jwt.sign({ id: result.id, type: result.type }, SECRET),
			});
		} catch (err) {
			console.log(err);
			if (err.code == '23505') {
				return next({
					status: 400,
					message: err.detail,
				});
			}
			return next({ status: 500 });
		}
	}
);

router.put(
	'/:id',
	authMiddleware.isLoggedIn,
	validateBody(authValidation.updateUser),
	async (req, res, next) => {
		let token = req.headers['authorization'];
		const userId = getUserIdByToken(token);
		if (req.params.id !== userId) {
			return next({ status: 401, message: 'UserId mismatch' });
		}

		try {
			const [result] = await authService.updateUser(req.params.id, req.body);
			return res.send(result);
		} catch (err) {
			if (err.code == '23505') {
				console.log(err);
				return next({ status: 400, message: err.detail });
			}
			console.log(err);
			return next({ status: 500 });
		}
	}
);

module.exports = {
	router,
};
