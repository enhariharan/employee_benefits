"use strict";

const { logger } = require('../config/logger');

exports.InvalidQueryParams = class {
  constructor(data, message) {
    this.status = 400;
    this.errCode = 'InvalidQueryParams';
    this.message = message || 'Some query params are incorrect.';
    if (data) {
      this.data = data;
    }

    logger.error(this.message);
  }
}

exports.BadRequest = class {
  get [Symbol.toStringTag]() {
    return 'BadRequest'; // Refer unit test in test/employeeStatusTest.js to see how this sting tag is used.
  }

  constructor(data, message) {
    this.status = 400;
    this.errCode = 'BadRequest';
    this.message = message || 'Bad Request';
    if (data) {
      this.data = data;
    }

    logger.error(this.message);
  }
}
