import { DataTypes } from "sequelize";
import sequelize from "../utils/database.js";

// see https://stackoverflow.com/questions/50200954/database-best-practice-countries-country-codes-country-phone-codes

const Country = sequelize.define("countries", {});

export default Country;
