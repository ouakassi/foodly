import { DataTypes } from "sequelize";
import sequelize from "../utils/database.js";

const ProductVariant = sequelize.define(
  "variant",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [1, 100],
      },
    },
    sku: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true,
    },
    price: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    stock: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    isDefault: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    attributes: {
      type: DataTypes.JSON, // e.g., { size: 'Large', color: 'Red' }
    },
  },
  {
    paranoid: true,
  }
);

export default ProductVariant;
