import { DataTypes } from "sequelize";
import sequelize from "../utils/database";

const Inventory = sequelize.define("Inventory", {
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
});

export default Inventory;
