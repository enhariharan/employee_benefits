"use strict";

const { logger } = require('../config/logger');

exports.ServerError = class {
  constructor(errCode, message, data) {
    this.status = 500;
    if (errCode) {
      this.errCode = 'ServerError';
    }
    this.message = message ? message : 'Internal Server Error';
    if (data) {
      this.data = data;
    }

    logger.error(this.message);
  }
}
