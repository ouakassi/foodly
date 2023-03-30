const { DataTypes } = require("sequelize");
const sequelize = require("../utils/database");

const Product = sequelize.define("product", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  imgUrl: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  price: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM,
    values: ["active", "inactive"],
    defaultValue: "active",
    allowNull: false,
  },
  desc: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
});

module.exports = Product;
