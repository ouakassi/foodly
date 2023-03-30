const { DataTypes } = require("sequelize");
const sequelize = require("../../utils/database");

const Cart = sequelize.define(
  "carts",
  {
    total: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  { timestamps: false }
);

module.exports = Cart;
