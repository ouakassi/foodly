const { DataTypes } = require("sequelize");
const sequelize = require("../utils/database");

const ProductDiscount = sequelize.define("productDiscount", {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  desc: {
    type: DataTypes.STRING,
  },
  discountPercent: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    allowNull: false,
    validate: {
      min: 0,
      max: 100,
    },
  },
  active: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
});

module.exports = ProductDiscount;
