const { DataTypes } = require("sequelize");
const sequelize = require("../utils/database");

// see https://stackoverflow.com/questions/50200954/database-best-practice-countries-country-codes-country-phone-codes

const Country = sequelize.define("countries", {});

module.exports = Country;
