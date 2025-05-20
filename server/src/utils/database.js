import { Sequelize } from "sequelize";
import dbConfig from "../configs/dbConfig.js";
import { dbLogger } from "../utils/logger.js";

const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,
  operatorsAliases: 0,
  logging: dbLogger.info.bind(dbLogger),
  pool: {
    max: dbConfig.pool.max,
    min: dbConfig.pool.min,
    acquire: dbConfig.pool.acquire,
    idle: dbConfig.pool.idle,
  },
});

export default sequelize;
