const { DataTypes } = require("sequelize");
const sequelize = require("../../utils/database");

const CartItem = sequelize.define(
  "cartItems",
  {
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  { timestamps: false }
);

module.exports = CartItem;
