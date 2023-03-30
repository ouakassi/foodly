const { DataTypes } = require("sequelize");
const sequelize = require("../../utils/database");

const Review = sequelize.define("review", {
  rating: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 5,
  },
  comment: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
});

module.exports = Review;
