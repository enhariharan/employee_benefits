"use strict";

const { logger } = require('../config/logger');

exports.Success = class {
  constructor(data, message) {
    this.status = 200;
    this.errCode = 'Success';
    if (data) {
      this.data = data;
    }
    this.message = message ? message : 'Success';

    logger.info(this.message);
  }
}

exports.SuccessCreated = class {
  constructor(data, message) {
    this.status = 201;
    this.errCode = 'Success';
    if (data) {
      this.data = data;
    }
    this.message = message ? message : 'Successfully created.';

    logger.info(this.message);
  }
}
