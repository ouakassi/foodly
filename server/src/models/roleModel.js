const { DataTypes } = require("sequelize");
const sequelize = require("../utils/database");
const roles = require("../utils/constants");

const Role = sequelize.define("role", {
  name: {
    allowNull: false,
    unique: true,
    type: DataTypes.ENUM,
    values: [roles.ADMIN, roles.MODERATOR, roles.USER],
    defaultValue: roles.USER,
  },
});

module.exports = Role;
