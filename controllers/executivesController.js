"use strict";

const executivesService = require('../services/executivesService');
const commonService = require('../services/commonService');
const {logger} = require('../config/logger');
const {validationResult} = require('express-validator');
const {ROLE_MANAGER} = require('../services/employeeStatus');
const {InvalidQueryParams} = require('../errors/invalidQueryParams');
const {Success} = require('../errors/success');

const getExecutives = (req, res) => {
  logger.info(`${module.id}.${getExecutives.name}()`);

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const err = new InvalidQueryParams(errors.array());
    res.status(err.status).json(err);
    return;
  }

  executivesService.getExecutives(req.decodedTokenData, req.query)
  .then(executives => {
    const message = (executives && executives.length) ? `${executives.length} executives returned.` : `No executive returned.`;
    const _dto = new Success(executives, message);
    logger.verbose(`_dto: ${JSON.stringify(_dto)}`)
    res.status(_dto.status).json(_dto);
  })
  .catch(err => {
    if (err && err.status) {
      res.status(err.status).json(err);
      return;
    }
    res.status(500).json(err);
  });
}

const addExecutives = (req, res) => {
  logger.debug(`${module.id}.${getExecutives.name}()`);

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const err = new InvalidQueryParams(errors.array());
    res.status(err.status).json(err);
    return;
  }

  executivesService.addExecutives(req.decodedTokenData, req.body)
  .then(executives => {
    const message = (executives && executives.length) ? `${executives.length} executives added.` : `No executive added.`;
    const _dto = new Success(executives, message);
    res.status(_dto.status).json(_dto);
  })
  .catch(err => {
    if (err && err.status) {
      res.status(err.status).json(err);
      return;
    }
    res.status(500).json(err);
  });
};

const updateCorporateExecutives = (req, res) => {

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const err = new InvalidQueryParams(errors.array());
    res.status(err.status).json(err);
    return;
  }

  executivesService.updateCorporateExecutives(req.body.corporateUuid, req.body.executiveUuid)
  .then(result => {
    const _dto = new Success(result);
    res.status(_dto.status).json(_dto);
  })
  .catch(err => {
    if (err && err.status) {
      res.status(err.status).json(err);
      return;
    }
    res.status(500).json(err);
  });
}

const getAllEmployeeReportedIssues = (req, res) => {
  logger.info(`${module.id}.${getAllEmployeeReportedIssues.name}()`);
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const err = new InvalidQueryParams(errors.array());
    res.status(err.status).json(err);
    return;
  }

  const details = req.decodedTokenData;
  if(details.role === ROLE_MANAGER){
    commonService.getCorporatesByExcecutiveMappedByManager(details.empid)
    .then(corporateIds => {
      let corporatesList = [];
      corporateIds.forEach(corp => {
        corporatesList.push(corp.corporateUuid);
      });      
      return commonService.getAllEmployeeReportedIssues(corporatesList, req.query.fromDate, req.query.toDate);
     })
    .then(result => {
      const _dto = new Success(result);
      res.status(_dto.status).json(_dto);
    })
    .catch(err => {
      if (err && err.status) {
        res.status(err.status).json(err);
        return;
      }
      res.status(500).json(err);
    });
  } else{
    executivesService.getExecutiveMappedCorportatesByUUid(details.executiveUuid)
    .then(mappedCorporates => {
      console.log(mappedCorporates);
      let corporatesList = [];
      if (req.query.corporateUuid) {
        corporatesList.push(req.query.corporateUuid);
      } else {
        if (mappedCorporates && mappedCorporates.length) {
          mappedCorporates.forEach(mapping => {
            corporatesList.push(mapping.corporateUuid);
          });
        }
      }
      return commonService.getAllEmployeeReportedIssues(corporatesList, req.query.fromDate, req.query.toDate);
    })
    .then(result => {
      const _dto = new Success(result);
      res.status(_dto.status).json(_dto);
    })
    .catch(err => {
      if (err && err.status) {
        res.status(err.status).json(err);
        return;
      }
      res.status(500).json(err);
    });
  }
 
}

const getAllEmployeeRequestedCallbacks = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const err = new InvalidQueryParams(errors.array());
    res.status(err.status).json(err);
    return;
  }

  const details = req.decodedTokenData;
  if(details.role === ROLE_MANAGER){
    commonService.getCorporatesByExcecutiveMappedByManager(details.empid)
    .then(corporateIds => {
      let corporatesList = [];
      corporateIds.forEach(corp => {
        corporatesList.push(corp.corporateUuid);
      });      
      return commonService.getAllEmployeeRequestedCallbacks(corporatesList, req.query.fromDate, req.query.toDate);
      })
      .then(result => {
        const _dto = new Success(result);
        res.status(_dto.status).json(_dto);
      })
      .catch(err => {
        if (err && err.status) {
          res.status(err.status).json(err);
          return;
        }
        res.status(500).json(err);
      });
  } else{
      executivesService.getExecutiveMappedCorportatesByUUid(details.executiveUuid)
      .then(mappedCorporates => {
        let corporatesList = [];
        if (req.query.corporateUuid) {
          corporatesList.push(req.query.corporateUuid);
        } else {
          if (mappedCorporates && mappedCorporates.length) {
            mappedCorporates.forEach(mapping => {
              corporatesList.push(mapping.corporateUuid);
            });
          }
        }
        return commonService.getAllEmployeeRequestedCallbacks(corporatesList, req.query.fromDate, req.query.toDate);
      })
      .then(result => {
        const _dto = new Success(result);
        res.status(_dto.status).json(_dto);
      })
      .catch(err => {
        if (err && err.status) {
          res.status(err.status).json(err);
          return;
        }
        res.status(500).json(err);
      });
  }
}

const updateEmployeeReportedIssue = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const err = new InvalidQueryParams(errors.array());
    res.status(err.status).json(err);
    return;
  }

  const details = req.decodedTokenData;
  executivesService.updateEmployeeReportedIssue(details.executiveUuid, req.body.complaintId, req.body.status, req.body.resolution, req.body.resolvedDate)
  .then(result => {
    const _dto = new Success(result);
    res.status(_dto.status).json(_dto);
  })
  .catch(err => {
    if (err && err.status) {
      res.status(err.status).json(err);
      return;
    }
    res.status(500).json(err);
  });
}


const updateEmployeeReportedCallback = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const err = new InvalidQueryParams(errors.array());
    res.status(err.status).json(err);
    return;
  }

  const details = req.decodedTokenData;
  executivesService.updateEmployeeReportedCallback(details.executiveUuid, req.body.requestId,  req.body.status, req.body.comments)
  .then(result => {
    const _dto = new Success(result);
    res.status(_dto.status).json(_dto);
  })
  .catch(err => {
    if (err && err.status) {
      res.status(err.status).json(err);
      return;
    }
    res.status(500).json(err);
  });
}


module.exports = {
  addExecutives: addExecutives,
  getAllEmployeeReportedIssues: getAllEmployeeReportedIssues,
  getAllEmployeeRequestedCallbacks: getAllEmployeeRequestedCallbacks,
  getExecutives: getExecutives,
  updateCorporateExecutives: updateCorporateExecutives,
  updateEmployeeReportedCallback: updateEmployeeReportedCallback,
  updateEmployeeReportedIssue: updateEmployeeReportedIssue
}
