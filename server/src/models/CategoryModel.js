import { DataTypes } from "sequelize";
import sequelize from "../utils/database.js";
import { generateSlug } from "../utils/helpers.js";

const Category = sequelize.define(
  "Category",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: {
          msg: "Category name cannot be empty",
        },
        len: {
          args: [2, 100],
          msg: "Category name must be between 2 and 100 characters",
        },
      },
    },
    slug: {
      type: DataTypes.STRING(120),
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
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
      validate: {
        len: {
          args: [0, 500],
          msg: "Description cannot exceed 500 characters",
        },
      },
    },
  },
  {
    paranoid: true, // Soft deletes

    hooks: {
      beforeCreate: async (category) => {
        if (!category.slug) {
          category.slug = generateSlug(category.name);
        }
      },
      beforeUpdate: async (category) => {
        if (category.changed("name") && !category.changed("slug")) {
          category.slug = generateSlug(category.name);
        }
      },
    },
  }
);

export default Category;
