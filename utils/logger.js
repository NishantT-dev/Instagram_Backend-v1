import { createLogger, format, transports } from "winston"
const logger = createLogger({
  level: "info", // default level
  format: format.combine(
    format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    format.colorize(),
    format.printf(({ timestamp, level, message }) => {
      return `[${timestamp}] ${level}: ${message}`;
    }),
  ),
  transports: [
    // Console output
    new transports.Console(),

    // File for info logs
    new transports.File({ filename: "logs/info.log", level: "info" }),

    // File for error logs
    new transports.File({ filename: "logs/error.log", level: "error" }),
  ],
});

export default logger;