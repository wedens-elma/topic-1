const jsonwebtoken = require("jsonwebtoken");

exports.getTokenFromHeaders = (headers) => {
	const { authorization } = headers;

	if (!authorization || authorization == "") {
		throw new Error(`Unauthorized! 1`);
	}
	const splittedAuth = authorization.split(" ");
	if (splittedAuth.length < 2) {
		throw new Error("Unauthorized!  2");
	}
	if (splittedAuth[0] != "Bearer") {
		throw new Error("Unauthorized! 3");
	}

	const token = splittedAuth[1];

	return token;
};

exports.extractToken = (token) => {
	const decoded = jsonwebtoken.verify(token, process.env.JWT_SECRET);

	return decoded;
};
