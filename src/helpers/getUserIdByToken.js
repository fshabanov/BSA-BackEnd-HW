const jwt = require('jsonwebtoken');
const { ENV } = require('../common/enums/enums');

const {
	JWT: { SECRET },
} = ENV;

const getUserIdByToken = (token) => {
	token = token.replace('Bearer ', '');
	const tokenPayload = jwt.verify(token, SECRET);
	return tokenPayload.id;
};

module.exports = { getUserIdByToken };
