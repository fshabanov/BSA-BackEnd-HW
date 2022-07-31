const jwt = require('jsonwebtoken');
const { ENV } = require('../../common/enums/enums');

const {
	JWT: { SECRET },
} = ENV;

const notAuthorized = (next) =>
	next({ status: 401, message: 'Not Authorized' });

const isAdmin = (req, _res, next) => {
	let token = req.headers['authorization'];
	if (!token) {
		return notAuthorized(next);
	}
	token = token.replace('Bearer ', '');
	try {
		var tokenPayload = jwt.verify(token, SECRET);
		if (tokenPayload.type != 'admin') {
			throw new Error();
		}
		next();
	} catch (err) {
		return notAuthorized(next);
	}
};

const isLoggedIn = (req, _res, next) => {
	let token = req.headers['authorization'];
	if (!token) {
		return notAuthorized(next);
	}
	token = token.replace('Bearer ', '');
	try {
		jwt.verify(token, SECRET);

		next();
	} catch (err) {
		return notAuthorized(next);
	}
};

module.exports = { isLoggedIn, isAdmin };
