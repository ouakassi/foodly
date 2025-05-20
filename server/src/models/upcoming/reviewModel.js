import { DataTypes } from "sequelize";
import sequelize from "../../utils/database";

const Review = sequelize.define("review", {
  rating: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 5,
  },
  comment: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
});

export default Review;
