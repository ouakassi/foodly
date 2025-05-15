const { DataTypes } = require("sequelize");
const sequelize = require("../utils/database");

const Order = sequelize.define("order_items", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },

  orderId: {
    type: DataTypes.UUID,
    allowNull: false,
  },

  productId: {
    type: DataTypes.UUID,
    allowNull: false,
  },

  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },

  price: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
});

module.exports = Order;
