import { DataTypes } from "sequelize";
import sequelize from "../utils/database.js";

const Address = sequelize.define("addresses", {
  addressLineOne: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  addressLineTwo: {
    type: DataTypes.TEXT,
  },
  city: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  postalCode: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  country: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

export default Address;
