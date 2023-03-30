const { DataTypes } = require("sequelize");
const sequelize = require("../utils/database");

const Inventory = sequelize.define("Inventory", {
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
});

module.exports = Inventory;
