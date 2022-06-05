"use strict";

const { logger } = require('../config/logger');

exports.InvalidCredentials = class {
  constructor(message, data) {
    this.status = 400;
    this.errCode = 'InvalidCredentials';
    this.message = message ? message : 'Authorization failed for this credential.';
    if (data) {
      this.data = data;
    }

    logger.error(this.message);
  }
}

exports.UnauthorizedAccess = class {
  constructor(message, data) {
    this.status = 401;
    this.errCode = 'UnauthorizedAccess';
    this.message = message ? message: 'Unauthorized access to resource.';
    if (data) {
      this.data = data;
    }

    logger.error(this.message);
  }
}
