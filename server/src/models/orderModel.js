import { DataTypes } from "sequelize";
import sequelize from "../utils/database.js";
import {
  ORDER_STATUSES,
  ORDER_STATUS_VALUES_ARRAY,
} from "../utils/constants.js";

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
    type: DataTypes.ENUM(...ORDER_STATUS_VALUES_ARRAY),
    allowNull: false,
    defaultValue: ORDER_STATUSES.PENDING,
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

export default Order;
