const jwt = require('jsonwebtoken');

const notAuthorized = (next) =>
	next({ status: 401, message: 'Not Authorized' });

const isAdmin = (req, _res, next) => {
	let token = req.headers['authorization'];
	if (!token) {
		return notAuthorized(next);
	}
	token = token.replace('Bearer ', '');
	try {
		var tokenPayload = jwt.verify(token, process.env.JWT_SECRET);
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
		jwt.verify(token, process.env.JWT_SECRET);

		next();
	} catch (err) {
		return notAuthorized(next);
	}
};

module.exports = { isLoggedIn, isAdmin };
