const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
	const authHeader = req.get('Authorization');

	if (!authHeader) {
		req.isAuth = 0;
		return next();
	}

	const token = authHeader.split(' ')[1];
	if (!token) {
		req.isAuth = false;
		return next();
	}
	try {
		const decodedToken = jwt.verify(token, 'MY_PRIVATE_SECRET_KEY');
		if (!decodedToken) {
			req.isAuth = false;
			return next();
		} else {
			req.isAuth = true;
			req.userId = decodedToken.userId;
			return next();
		}
	} catch (error) {
		req.isAuth = false;
		return next();
	}
};
