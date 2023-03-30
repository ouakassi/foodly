const { DataTypes } = require("sequelize");
const sequelize = require("../../utils/database");

const Order = sequelize.define("orders", {
  total_amount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM("created", "confirmed", "shipped", "delivered"),
    defaultValue: "created",
  },
});

module.exports = Order;
