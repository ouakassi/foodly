import { DataTypes } from "sequelize";
import sequelize from "../utils/database.js";
import { ROLES } from "../utils/constants.js";

const Role = sequelize.define("role", {
  name: {
    allowNull: false,
    unique: true,
    type: DataTypes.ENUM,
    values: [ROLES.ADMIN, ROLES.MODERATOR, ROLES.USER],
    defaultValue: ROLES.USER,
  },
});

export default Role;
