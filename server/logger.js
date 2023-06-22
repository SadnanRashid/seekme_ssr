const winston = require("winston");
const { format } = require("winston");

const logger = winston.createLogger({
  level: "info",
  format: format.combine(
    format.timestamp(),
    format.printf(
      ({ timestamp, level, message, method, url, responseTime }) => {
        return `${timestamp} ${level}: ${message} | Method: ${method} | URL: ${url} | Response Time: ${responseTime}ms`;
      }
    )
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: "server.log" }),
  ],
});

module.exports = logger;
