import { DataTypes } from "sequelize";
import sequelize from "../../utils/database";

const Coupon = sequelize.define("coupons", {
  code: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  discountAmount: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  expirationDate: {
    type: DataTypes.DATE,
  },
});

export default Coupon;
