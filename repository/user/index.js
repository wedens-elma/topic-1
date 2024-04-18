const crypto = require("crypto");
const path = require("path");
const bcrypt = require("bcrypt");
const { getData, setData, deleteData } = require("../../helper/redis");
const { uploader } = require("../../helper/cloudinary");
const { user } = require("../../models");

exports.createUser = async (payload) => {
	// encrypt the password
	payload.password = bcrypt.hashSync(payload.password, 10);

	if (payload.photo) {
		// upload image to cloudinary
		const { photo } = payload;

		// make unique filename -> 213123128uasod9as8djas
		photo.publicId = crypto.randomBytes(16).toString("hex");

		// rename the file -> 213123128uasod9as8djas.jpg / 213123128uasod9as8djas.png
		photo.name = `${photo.publicId}${path.parse(photo.name).ext}`;

		// Process to upload image
		const imageUpload = await uploader(photo);
		payload.photo = imageUpload.secure_url;
	}

	// save to db
	const data = await user.create(payload);

	// save to redis
	const keyId = `user:${data.id}`;
	await setData(keyId, data, 300);

	const keyEmail = `user:${data.email}`;
	await setData(keyEmail, data, 300);

	return data;
};

exports.getUserById = async (id) => {
	const key = `user:${id}`;

	let data = await getData(key);
	if (data) {
		return data;
	}

	data = await user.findAll({
		where: {
			id,
		},
	});
	if (data.length > 0) {
		await setData(key, data[0], 300);
		return data[0];
	}

	throw new Error(`User is not found`);
};

exports.getUserByEmail = async (email) => {
	const key = `user:${email}`;

	let data = await getData(key);
	if (data) {
		return data;
	}

	data = await user.findAll({
		where: {
			email,
		},
	});
	if (data.length > 0) {
		await setData(key, data[0], 300);
		return data[0];
	}

	throw new Error(`User is not found`);
};
