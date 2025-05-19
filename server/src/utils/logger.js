const { createLogger, format, transports } = require("winston");
const DailyRotateFile = require("winston-daily-rotate-file");
const path = require("path");

const {
  combine,
  timestamp,
  errors,
  splat,
  json,
  colorize,
  printf,
  prettyPrint,
  cli,
} = format;

const logDirectory = path.join(__dirname, "../", "logs");

// Custom format to sanitize sensitive info
const sanitizeSensitive = format((info) => {
  if (info.meta?.password) {
    info.meta.password = "***";
  }
  return info;
});

// Custom format for console in dev
const devConsoleFormat = printf(({ level, message, timestamp, ...rest }) => {
  return `${timestamp} ${level}: ${message || rest?.meta?.message || ""}`;
});

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
      filename: path.join(logDirectory, "dbErrorsLogs.log"),
      level: "error",
    }),
    new transports.File({
      filename: path.join(logDirectory, "dbLogs.log"),
      level: "info",
    }),
  ],
});

// HTTP Logger
const httpLogger = createLogger({
  level: "http",
  format: combine(
    timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    sanitizeSensitive(),
    json(),
    prettyPrint()
  ),
  transports: [
    new DailyRotateFile({
      filename: path.join(logDirectory, "requestsLogs-%DATE%.log"),
      datePattern: "YYYY-MM-DD",
      maxSize: "10m",
      maxFiles: "14d",
    }),
  ],
});

if (process.env.NODE_ENV !== "production") {
  httpLogger.add(
    new transports.Console({
      format: combine(colorize(), devConsoleFormat),
    })
  );
}

// httpLogger.error("hey", { data: "daata" });

const customErrorsFormat = format.printf(({ level, timestamp, meta }) => {
  return `${timestamp} ${level}: ${meta.message}`;
});

const errorsLogger = createLogger({
  level: "error",
  format: combine(
    timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    sanitizeSensitive(),
    json(),
    printf(
      ({ level, timestamp, meta }) => `${timestamp} ${level}: ${meta?.message}`
    )
  ),
  transports: [
    new DailyRotateFile({
      filename: path.join(logDirectory, "loggsInternalErrors-%DATE%.log"),
      datePattern: "YYYY-MM-DD",
      maxSize: "10m",
      maxFiles: "30d",
    }),
  ],
});

// Handle uncaught exceptions
errorsLogger.exceptions.handle(
  new transports.File({
    filename: path.join(logDirectory, "uncaughtExceptions.log"),
  })
);

// Handle unhandled rejections
process.on("unhandledRejection", (err) => {
  errorsLogger.error("Unhandled Rejection", {
    meta: { message: err.message, stack: err.stack },
  });
});

// Unified log function
const log = (tag = "http", level = "info", message, meta = {}) => {
  const loggers = {
    db: dbLogger,
    http: httpLogger,
    error: errorsLogger,
  };

  const logger = loggers[tag];
  if (logger && typeof logger[level] === "function") {
    logger[level](message, { meta });
  }
};

module.exports = { httpLogger, dbLogger, errorsLogger, log };
