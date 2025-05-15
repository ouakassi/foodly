const { DataTypes } = require("sequelize");
const sequelize = require("../utils/database");

const Order = sequelize.define("orders", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },

  userId: {
    type: DataTypes.UUID,
    allowNull: false,
  },

  totalAmount: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },

  status: {
    type: DataTypes.ENUM(
      "pending",
      "paid",
      "processing",
      "shipped",
      "delivered",
      "completed",
      "cancelled",
      "returned",
      "refunded",
      "failed",
      "expired"
    ),
    allowNull: false,
    defaultValue: "pending",
  },

  paymentMethod: {
    type: DataTypes.STRING, // e.g. 'credit_card', 'paypal', 'cod'
    allowNull: true,
  },

  shippingAddress: {
    type: DataTypes.STRING,
    allowNull: true,
  },

  trackingNumber: {
    type: DataTypes.STRING,
    allowNull: true,
  },

  shippedAt: {
    type: DataTypes.DATE,
    allowNull: true,
  },

  deliveredAt: {
    type: DataTypes.DATE,
    allowNull: true,
  },
});

module.exports = Order;
