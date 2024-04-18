const {
	createUser,
	getUserByEmail,
	getUserById,
} = require("../../repository/user");
const jsonwebtoken = require("jsonwebtoken");
const bcrypt = require("bcrypt");

exports.register = async (payload) => {
	const user = await createUser(payload);

	// user = await getUserByEmail(payload.email);

	delete user.dataValues.password;

	const jwtPayload = {
		id: user.id,
	};

	const token = jsonwebtoken.sign(jwtPayload, process.env.JWT_SECRET, {
		expiresIn: "1h",
	});

	const data = {
		user,
		token,
	};

	return data;
};

exports.loginUser = async (email, password) => {
	try {
		// find user by email
		const user = await getUserByEmail(email);
		if (!user) {
			throw new Error("User not found");
		}

		// compare password
		const isPasswordValid = await bcrypt.compare(password, user?.password);
		if (!isPasswordValid) {
			throw new Error("Wrong password");
		}

		// generate JWT token
		const token = jsonwebtoken.sign({ id: user.id }, process.env.JWT_SECRET, {
			expiresIn: "1h",
		});

		if (user?.dataValues?.password) {
			delete user?.dataValues?.password;
		} else {
			delete user?.password;
		}

		return { user, token };
	} catch (error) {
		throw error;
	}
};

exports.profile = async (id) => {
	let data = await getUserById(id);

	if (!data) {
		throw new Error(`User is not found!`);
	}

	if (data?.dataValues?.password) {
		delete data?.dataValues?.password;
	} else {
		delete data?.password;
	}

	return data;
};
