const jwt = require('jsonwebtoken');

const getUserIdByToken = (token) => {
	token = token.replace('Bearer ', '');
	const tokenPayload = jwt.verify(token, process.env.JWT_SECRET);
	return tokenPayload.id;
};

module.exports = { getUserIdByToken };
