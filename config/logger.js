"use strict";

const winston = require('winston');
const {Loggly} = require('winston-loggly-bulk'); // Do not remove this line even for jslint warning.
require('winston-daily-rotate-file');

const options = {
  rotateFile: {
    level: (['development', 'staging', 'test'].includes(process.env.NODE_ENV)) ? 'debug' : 'info',
    dirname: 'logs/',
    filename: 'eb_server_%DATE%',
    extension: '.log',
    datePattern: 'YYYY_MM_DD',
    handleExceptions: true,
    json: true,
    maxsize: '20m',
    maxfiles: '30d', // Store log files for 30 days
    zippedArchive: true,
    tailable: true,
    colorize: false,
  },
  console: {
    level: 'debug',
    handleExceptions: true,
    json: false,
    tailable: true,
    colorize: true,
  },
  loggly: {
    level: 'info',
    subdomain: "anil",
    token: "48d51c6b-45cb-4475-bb9a-c597c2587cbf",
    json: true,
    tags: ["eb_server"]
  }
};

const dailyRotateFileTransport = new winston.transports.DailyRotateFile(options.rotateFile);
dailyRotateFileTransport.on('new', newFilename => {
  console.log('New log file created - [%s]', newFilename);
});
dailyRotateFileTransport.on('rotate', (oldFilename, newFilename) => {
  console.log('New rotate log file created - [old: [%s], new: [%s]]', oldFilename, newFilename);
});
dailyRotateFileTransport.on('archive', zipFilename => {
  console.log('New archive file created - [%s]', zipFilename);
});
dailyRotateFileTransport.on('logRemoved', removedFilename => {
  console.log('log file removed - [%s]', removedFilename);
});

const consoleTransport = new winston.transports.Console(options.console);

const logglyTransport = new Loggly(options.loggly);

const transports = [
  dailyRotateFileTransport,
  consoleTransport
];

// Log only production server logs into Loggly service.
if (process.env.NODE_ENV === 'production') {
  transports.push(logglyTransport);
}

const _logger = winston.createLogger({
  transports: transports,
  exitOnError: false, // do not exit on handled exceptions
});
_logger.on('finish', info => {
  console.log('All info logs have been logged into all transports.');
  console.log(info);
});
_logger.on('error', err => {
  console.log('Error occurred in the logger module.');
  console.log(err);
});
_logger.stream = {
  write: message => {
    _logger.info(message);
  },
};

const close = () => {
  _logger.end(() => {
    console.log('logger closed.')
  });
};

module.exports = {
  logger: _logger,
  debug: _logger.debug,
  error: _logger.error,
  info: _logger.info,
  verbose: _logger.verbose,
  stream: _logger.stream,
  close: close,
};