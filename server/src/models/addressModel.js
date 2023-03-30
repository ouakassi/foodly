const { DataTypes } = require("sequelize");
const sequelize = require("../utils/database");

const Address = sequelize.define("addresses", {
  addressLineOne: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  addressLineTwo: {
    type: DataTypes.TEXT,
  },
  city: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  postalCode: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  country: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

module.exports = Address;
