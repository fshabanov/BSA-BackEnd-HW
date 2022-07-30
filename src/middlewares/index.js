const authMiddleware = require('./auth/auth.middleware');
const validatorMiddleware = require('./validator/validator.middleware');

module.exports = {
	authMiddleware,
	validatorMiddleware,
};
