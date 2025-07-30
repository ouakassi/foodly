import { DataTypes } from "sequelize";
import sequelize from "../utils/database.js";
import { generateSlug } from "../utils/model.js";
import { PRODUCT_STATUS_VALUES_ARRAY } from "../utils/constants.js";

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
    basePrice: {
      type: DataTypes.FLOAT,
      allowNull: true,
      validate: {
        min: 0,
      },
    },
    stock: {
      type: DataTypes.INTEGER,
      allowNull: true,
      validate: {
        min: 0,
      },
    },
    status: {
      type: DataTypes.STRING,
      defaultValue: PRODUCT_STATUS_VALUES_ARRAY[0], // Default to "active"
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
    hooks: {
      beforeCreate: async (product) => {
        if (!product.slug) {
          product.slug = generateSlug(product.name);
        }
      },
      beforeUpdate: async (product) => {
        if (product.changed("name") && !product.changed("slug")) {
          product.slug = generateSlug(product.name);
        }
      },
    },
  }
);

export default Product;
