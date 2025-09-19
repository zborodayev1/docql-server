import fs from "fs";
import path from "path";
import winston from "winston";

const customLevels = {
  levels: {
    error: 0,
    code_error: 1,
    fail: 2,
    warn: 3,
    success: 4,
    info: 5,
    worker: 6,
    DB: 7,
  },
  colors: {
    DB: "cyan",
    worker: "magenta",
    success: "green",
    fail: "yellow",
    code_error: "red",
    info: "blue",
    warn: "yellow",
    error: "red",
  },
};

const logDir = path.resolve("logs");
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

const { combine, timestamp, printf, colorize, errors } = winston.format;

const logFormat = printf(({ level, message, timestamp, stack }) => {
  return `[${timestamp}] ${level}: ${stack || message}`;
});

winston.addColors(customLevels.colors);

export const logger = winston.createLogger({
  levels: customLevels.levels,
  level: "DB",
  format: combine(timestamp({ format: "YYYY-MM-DD HH:mm:ss" }), errors({ stack: true }), logFormat),
  transports: [
    new winston.transports.Console({
      format: combine(colorize(), logFormat),
    }),

    new winston.transports.File({
      filename: path.join(logDir, "app.log"),
      level: "success",
    }),

    new winston.transports.File({
      filename: path.join(logDir, "error.log"),
      level: "warn",
    }),
  ],
});
