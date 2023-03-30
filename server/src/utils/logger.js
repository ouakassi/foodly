const { createLogger, format, transports } = require("winston");
const path = require("path");

const dbLogger = createLogger({
  level: "info",
  format: format.combine(
    format.timestamp({
      format: "YYYY-MM-DD HH:mm:ss",
    }),
    format.errors({ stack: true }),
    format.splat(),
    format.json()
  ),
  defaultMeta: { service: "Sequelize Db" },
  transports: [
    new transports.File({
      filename: path.join(__dirname, "../", "logs", "dbErrorsLogs.log"),
      level: "error",
    }),
    new transports.File({
      filename: path.join(__dirname, "../", "logs", "dbLogs.log"),
      level: "info",
    }),
  ],
});

const httpLogger = createLogger({
  level: "http",
  format: format.combine(
    format.colorize({ all: true }),
    format.timestamp({
      format: "YYYY-MM-DD HH:mm:ss",
    }),
    format.cli(),
    format.json(),
    format.prettyPrint()
    // format.printf(
    //   ({ meta, timestamp }) =>
    //     `${timestamp}:\n${meta.req.method} ${meta.req.url} ${meta.res.statusCode} ${meta.responseTime} ms`
    // )
  ),

  transports: [
    new transports.Console(),
    new transports.File({
      filename: path.join(__dirname, "../", "logs", "requestsLogs.log"),
    }),
  ],
});

// httpLogger.error("hey", { data: "daata" });

const customErrorsFormat = format.printf(({ level, timestamp, meta }) => {
  return `${timestamp} ${level}: ${meta.message}`;
});

const errorsLogger = createLogger({
  transports: [
    new transports.File({
      filename: path.join(__dirname, "../", "logs", "loggsInternalErrors.log"),
      level: "error",
    }),
  ],
  format: format.combine(format.json(), format.timestamp(), customErrorsFormat),
});

module.exports = { httpLogger, dbLogger, errorsLogger };
