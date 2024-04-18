const { getTokenFromHeaders, extractToken } = require("../helper/auth");
const { register, loginUser, profile } = require("../usecase/auth");

exports.register = async (req, res, next) => {
	try {
		const { email, password, name } = req.body;
		const { photo } = req.files;

		if (email == "" || !email) {
			return next({
				message: "Email must be filled",
				statusCode: 400,
			});
		}
		if (password == "" || !password) {
			return next({
				message: "Password must be filled",
				statusCode: 400,
			});
		}
		if (name == "" || !name) {
			return next({
				message: "Name must be filled",
				statusCode: 400,
			});
		}

		const data = await register({
			email,
			password,
			name,
			photo,
		});

		res.status(200).json({
			message: "Success",
			data,
		});
	} catch (error) {
		next(error);
	}
};

exports.login = async (req, res, next) => {
	try {
		const { email, password } = req.body;
		if (email == "" || !email) {
			return next({
				message: "Email must be filled",
				statusCode: 400,
			});
		}
		if (password == "" || !password) {
			return next({
				message: "Password must be filled",
				statusCode: 400,
			});
		}
		const user = await loginUser(email, password);
		res.status(200).json({
			message: "Login Success",
			user,
		});
	} catch (error) {
		next(error);
	}
};

exports.profile = async (req, res, next) => {
	try {
		const data = await profile(req.user.id);

		console.log(data);

		res.status(200).json({
			message: "Retrieve profile success",
			data,
		});
	} catch (error) {
		next(error);
	}
};
