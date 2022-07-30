const validateBody = (schema) => {
	return (req, res, next) => {
		const isValidResult = schema.validate(req.body);
		console.log(isValidResult);
		if (isValidResult.error) {
			return next({
				status: 400,
				message: isValidResult.error.details[0].message,
			});
		}
		next();
	};
};

const validateParams = (schema) => {
	return (req, res, next) => {
		const isValidResult = schema.validate(req.params);
		console.log(isValidResult);
		if (isValidResult.error) {
			return next({
				status: 400,
				message: isValidResult.error.details[0].message,
			});
		}
		next();
	};
};

module.exports = {
	validateBody,
	validateParams,
};
