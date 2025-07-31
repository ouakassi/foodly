import { DataTypes } from "sequelize";
import sequelize from "../utils/database.js";
import { generateSlug } from "../utils/helpers.js";
import { PRODUCT_STATUS_VALUES } from "../utils/constants.js";

const Product = sequelize.define(
  "product",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    imgUrl: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    status: {
      type: DataTypes.STRING,
      defaultValue: PRODUCT_STATUS_VALUES.ACTIVE, // Default to "active"
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
      validate: {
        len: {
          args: [0, 1000],
          msg: "Description cannot exceed 1000 characters",
        },
      },
    },
    slug: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isLowercase: true,
        is: {
          args: /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
          msg: "Slug must be lowercase with hyphens only",
        },
      },
    },
  },
  {
    paranoid: true, // Soft deletes
  }
);

export default Product;
