const { DataTypes } = require("sequelize");
const sequelize = require("../../utils/database");

const Coupon = sequelize.define("coupons", {
  code: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  discountAmount: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  expirationDate: {
    type: DataTypes.DATE,
  },
});

module.exports = Coupon;
