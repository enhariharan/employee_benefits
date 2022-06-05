"use strict";

const { logger } = require('../config/logger');

exports.InvalidCorporate = class {
  constructor(message, data) {
    this.status = 400;
    this.errCode = 'InvalidCorporate';
    this.message = message ? message : 'Invalid Corporate';
    if (data) {
      this.data = data;
    }

    logger.error(this.message);
  }
}

exports.DuplicateCorporate = class {
  constructor(message, data) {
    this.status = 400;
    this.errCode = 'DuplicateCorporate';
    this.message = message ? message : 'Duplicate Corporate';
    if (data) {
      this.data = data;
    }

    logger.error(this.message);
  }
}

exports.InvalidCorporateStatus = class {
  constructor(data) {
    this.status = 400;
    this.errCode = 'InvalidCorporateStatus';
    this.message = `Corporate Status code is invalid`;
    if (data) {
      this.data = {status: data};
    }

    logger.error(this.message);
  }
}
