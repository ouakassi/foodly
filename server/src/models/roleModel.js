const { DataTypes } = require("sequelize");
const sequelize = require("../utils/database");
const { ROLES } = require("../utils/constants");

const Role = sequelize.define("role", {
  name: {
    allowNull: false,
    unique: true,
    type: DataTypes.ENUM,
    values: [ROLES.ADMIN, ROLES.MODERATOR, ROLES.USER],
    defaultValue: ROLES.USER,
  },
});

module.exports = Role;
