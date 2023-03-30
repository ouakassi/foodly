const { DataTypes } = require("sequelize");
const sequelize = require("../utils/database");

const ProductCategory = sequelize.define(
  "productCategories",
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    desc: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  },
  { timestamps: false }
);

module.exports = ProductCategory;
