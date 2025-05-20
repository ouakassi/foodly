import { DataTypes } from "sequelize";
import sequelize from "../../utils/database";

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

export default Cart;
