import { DataTypes } from "sequelize";
import sequelize from "../../utils/database";

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

export default Payment;
