const { DataTypes } = require("sequelize");
const sequelize = require("../../utils/database");

const Payment = sequelize.define(
  "payments",
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

module.exports = Payment;
