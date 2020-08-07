"use strict";

const { createLogger, format, transports } = require("winston");
const { splat, combine, timestamp, printf } = format;

function stackInfo() {
  let path = require("path");
  let stackReg = /at\s+(.*)\s+\((.*):(\d*):(\d*)\)/i;
  let stackReg2 = /at\s+()(.*):(\d*):(\d*)/i;
  let stacklist = new Error().stack.split("\n").slice(3);
  let s = stacklist[0];
  let sp = stackReg.exec(s) || stackReg2.exec(s);
  let data = {};
  if (sp && sp.length === 5) {
    data.method = sp[1];
    data.path = sp[2];
    data.line = sp[3];
    data.pos = sp[4];
    data.file = path.basename(data.path);
  }

  return data;
}

const myFormat = printf(({ timestamp, level, message, meta }) => {
  return `${timestamp} [${level}] ${message} ${
    meta ? JSON.stringify(meta) : ""
  }`;
});

module.exports = config => {
  // Get Configurations
  let role = "searchService";
  let winston_transports = [
    new transports.File({
      name: "debug_log",
      filename: config.log.debug_file,
      level: "debug",
      timestamp: true,
      json: false,
      maxsize: 56214400,
      maxFiles: 10,
      tailable: true
    }),
    new transports.Console({
      level: "debug"
    }),
    new transports.Console({
      level: "emerg" ///  for ut test
    })
  ];

  // Set Logger Configurations
  const logger_o = createLogger({
    format: combine(
      timestamp({ format: "YYYY-MM-DD HH:mm:ss.sss" }),
      splat(),
      myFormat
    ),
    transports: winston_transports
  });

  let logger = {};
  logger.debug = function(message) {
    let info = stackInfo();
    let method = info["method"];
    let file = info["file"];
    let line = info["line"];
    let new_message = file + ":" + "[" + method + "] <" + line + "> " + message;
    logger_o.debug(new_message);
  };

  logger.info = function(message) {
    let info = stackInfo();
    let method = info["method"];
    let file = info["file"];
    let line = info["line"];
    let new_message = file + ":" + "[" + method + "] <" + line + "> " + message;
    logger_o.info(new_message);
  };

  logger.warn = function(message) {
    let info = stackInfo();
    let method = info["method"];
    let file = info["file"];
    let line = info["line"];
    let new_message = file + ":" + "[" + method + "] <" + line + "> " + message;
    logger_o.warn(new_message);
  };

  logger.error = function(message) {
    let info = stackInfo();
    let method = info["method"];
    let file = info["file"];
    let line = info["line"];
    let new_message = file + ":" + "[" + method + "] <" + line + "> " + message;
    logger_o.error(new_message);
  };

  logger.emerg = function(message) {
    let info = stackInfo();
    let method = info["method"];
    let file = info["file"];
    let line = info["line"];
    let new_message = file + ":" + "[" + method + "] <" + line + "> " + message;
    logger_o.debug(new_message);
  };
  return logger;
};
