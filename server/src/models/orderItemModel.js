import { DataTypes } from "sequelize";
import sequelize from "../utils/database.js";

const OrderItem = sequelize.define("order_items", {
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

export default OrderItem;
