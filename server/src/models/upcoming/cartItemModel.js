import { DataTypes } from "sequelize";
import sequelize from "../../utils/database";

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

export default CartItem;
