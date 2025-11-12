import { DataTypes } from "sequelize";
import sequelize from "../utils/database.js";

const Coupon = sequelize.define(
  "coupon",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    code: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    type: {
      type: DataTypes.ENUM("percentage", "fixed"),
      allowNull: false,
    },
    value: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    usageLimit: {
      type: DataTypes.INTEGER,
      defaultValue: 1,
    },
    expiresAt: {
      type: DataTypes.DATE,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  },
  {
    paranoid: true,
  }
);

export default Coupon;
