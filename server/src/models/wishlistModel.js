const { DataTypes } = require("sequelize");
const sequelize = require("../utils/database");

const Wishlist = sequelize.define("wishlist", {
  // add any attributes you need
});

module.exports = Wishlist;
