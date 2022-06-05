const express = require('express');
const router = express.Router();
const claims = require('../controllers/claimsController');
const { query } = require('express-validator');

router.get('/', claims.addClaimsFromSoapByPolicyByDates); // TODO: Deprecated
router.get('/view', claims.viewAllSoapClaimsByPolicyByDates);

router.get(
  '/mediassist_claims',
  [
    query('policy').not().isEmpty().withMessage('cannot be empty'),
    query('fromDate').optional().not().isEmpty().withMessage('cannot be empty'),
    query('toDate').optional().not().isEmpty().withMessage('cannot be empty'),
  ],
  claims.mediAssistClaimsByPolicyByDates
);

router.get(
  '/fhpl_claims',
  [
    query('policy').not().isEmpty().withMessage('cannot be empty'),
    query('fromDate').optional().not().isEmpty().withMessage('cannot be empty'),
    query('toDate').optional().not().isEmpty().withMessage('cannot be empty'),
  ],
  claims.fhplClaimsByPolicyByDates
);


module.exports = router;
