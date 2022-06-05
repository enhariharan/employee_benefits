"use strict";

const notificationsService = require('../services/notificationsService');
const {Success} = require('../errors/success');

const getPendingActions = (req, res) => {
  notificationsService.getPendingActions(req.decodedTokenData)
  .then(result => {
    const message = (!result.employeeActions && !result.dependentsActions && !result.policyActions) ? 'No pending actions.' : 'Pending actions found.';
    const _dto = new Success(result, message);
    res.status(_dto.status).json(_dto);
  })
  .catch(err => {
    console.log(err);
    if (err && err.status) {
      res.status(err.status).send(err);
      return;
    }
    res.status(500).send(err);
  });
};

module.exports = {
  getPendingActions: getPendingActions
}