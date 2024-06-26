"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
	class user extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models) {
			// define association here
		}
	}
	user.init(
		{
			email: {
				type: DataTypes.STRING,
				unique: true,
			},
			password: DataTypes.TEXT,
			name: DataTypes.STRING,
			photo: DataTypes.TEXT,
			role: DataTypes.STRING,
		},
		{
			sequelize,
			modelName: "user",
			paranoid: true,
		}
	);
	return user;
};
