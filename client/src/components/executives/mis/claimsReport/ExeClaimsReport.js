import React, { Fragment, useContext, useState, useEffect } from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  BrowserRouter as Router,
  Route,
  Redirect,
  Switch,
  Link,
  useHistory,
} from 'react-router-dom';

import MomentReg from 'moment';

import update from 'immutability-helper';

import { Button } from '@material-ui/core';
import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';

import DateFnsUtils from '@date-io/date-fns';
import { MuiPickersUtilsProvider, DatePicker } from '@material-ui/pickers';

import { PubSub } from '../../../../services/PubSub';
import ApiService from '../../../../services/ApiService';
import { EMP_CONST } from '../../../../services/Constants';
import { AuthContext } from '../../../../context/AuthContext';
import { GlobalDataContext } from '../../../../context/GlobalDataContext';

import {
  CapitalizeFirstLetter,
  _employeeStatus,
  uniqueCorporateObject,
  underscoreToSpaceText,
  removeDuplicatesArray,
} from '../../../../reUseComponents/utils/utils';

const ExeClaimsReport = React.memo((props) => {
  const [globalOnLoadData, setGlobalOnLoadData] = useContext(GlobalDataContext);
  // console.log('ExeClaimsReport props ', props);

  const history = useHistory();

  let isGlobalCorporateData;
  !!globalOnLoadData &&
  Object.keys(globalOnLoadData).length > 0 &&
  !!globalOnLoadData.corporatesData
    ? (isGlobalCorporateData = true)
    : (isGlobalCorporateData = false);

  const [isMobile, setIsMobile] = useState(null);
  const [corporateObj, setCorporateObj] = useState(
    (!!globalOnLoadData.selectedCorporate &&
      globalOnLoadData.selectedCorporate) ||
      {}
  );
  const [corporateIdVal, setCorporateIdVal] = useState(
    (!!globalOnLoadData.selectedCorporate &&
      globalOnLoadData.selectedCorporate.companyName) ||
      ''
  );
  const [corporatesData, setCorporatesData] = useState(
    (!!isGlobalCorporateData && globalOnLoadData.corporatesData) || []
  );
  const [policiesData, setPoliciesData] = useState([]);
  const [policiesIdVal, setPoliciesIdVal] = useState('');

  const handleChangePolicyId = (e) => {
    if (!e.target.value) {
      return;
    }
    setPoliciesIdVal(e.target.value);
  };

  const [currentUser] = useContext(AuthContext);

  const handleChangeCorporate = (e) => {
    if (!!e.target.value) {
      setCorporateIdVal(e.target.value);
      let currentObj = corporatesData.filter(
        (obj) => obj.companyName === e.target.value
      );
      setCorporateObj(currentObj[0]);
      const updateCorporate = update(globalOnLoadData, {
        selectedCorporate: {
          $set: currentObj[0],
        },
      });
      setGlobalOnLoadData(updateCorporate);
      getAllPoliciesByCorporate(currentObj[0].uuid);
    }
  };
  useEffect(() => {
    if (!!globalOnLoadData.selectedCorporate) {
      getAllPoliciesByCorporate(globalOnLoadData.selectedCorporate.uuid);
    }

    PubSub.subscribe(PubSub.events.IS_MOBILE, (flag) => {
      setIsMobile(flag);
    });
    return () => {
      PubSub.unsubscribe(PubSub.events.IS_MOBILE);
    };
  }, []);

  useEffect(() => {
    if (!!globalOnLoadData.pendingActionsData) {
      getAllCorporates();
    }
  }, [!!globalOnLoadData.pendingActionsData]);

  const getAllPoliciesByCorporate = (corporateUuid) => {
    ApiService.get(
      `${EMP_CONST.URL.exe_policiesList}?corporateUuid=${corporateUuid}`
    )
      .then((response) => {
        // console.log('response getAllPoliciesByCorporate ', response);
        if (
          typeof response !== 'undefined' &&
          !!response.data &&
          response.data.length > 0
        ) {
          setPoliciesData(response.data);
        }
      })
      .catch((err) => {
        console.log(`Resend Error ${JSON.stringify(err)} `);
        if (!!err.data && (!!err.data.errCode || !!err.data.message)) {
          let respNotiObj = {
            message: err.data.message || err.data.errCode,
            color: 'error',
          };
          PubSub.publish(PubSub.events.SNACKBAR_PROVIDER, respNotiObj);
        }
      })
      .finally(() => {
        console.log(`Finally `);
      });
  };

  const getAllCorporates = () => {
    if (!!isGlobalCorporateData) {
      return;
    }
    ApiService.get(`${EMP_CONST.URL.exe_getCorporates}`)
      .then((response) => {
        // console.log('response getAllCorporates ', response);
        if (typeof response !== 'undefined') {
          let uniqueCorporateData = uniqueCorporateObject(response.data);
          setCorporatesData(uniqueCorporateData);
          const newCorporatesData = update(globalOnLoadData, {
            ['corporatesData']: {
              $set: uniqueCorporateData,
            },
          });
          setGlobalOnLoadData(newCorporatesData);
        }
      })
      .catch((err) => {
        console.log(`Resend Error ${JSON.stringify(err)} `);
        if (!!err.data && (!!err.data.errCode || !!err.data.message)) {
          let respNotiObj = {
            message: err.data.message || err.data.errCode,
            color: 'error',
          };
          PubSub.publish(PubSub.events.SNACKBAR_PROVIDER, respNotiObj);
        }
      })
      .finally(() => {
        console.log(`Finally `);
      });
  };

  const [fromDate, setFromDate] = useState(new Date('03-03-2020'));
  const [toDate, setToDate] = useState(new Date());
  const [claimsReportsData, setClaimsReportsData] = useState([]);
  const [claimsReportsStatusStrings, setClaimsReportsStatusStrings] = useState(
    []
  );
  const [
    cashlessReportedClaimsCount,
    setCashlessReportedClaimsCount,
  ] = useState({ noOfClaims: 0, claimAmount: 0, settledAmount: 0 });

  const [
    reimbursementReportedClaimsCount,
    setReimbursementReportedClaimsCount,
  ] = useState({ noOfClaims: 0, claimAmount: 0, settledAmount: 0 });

  const collectClaimStatus = (data) => {
    let newArray = data.map((obj, index) => {
      return !!obj.status ? obj.status : null;
    });
    // console.log('newArray ', newArray);
    removeDuplicatesArray(newArray);
    setClaimsReportsStatusStrings(newArray);
  };

  const reportedDataCalc = (data) => {
    let cashlessReportedClaimsCount = 0;
    let cashlessReportedClaimsAmount = 0;
    let cashlessReportedClaimsSettledAmount = 0;
    let reimbursementReportedClaimsCount = 0;
    let reimbursementReportedClaimsAmount = 0;
    let reimbursementReportedClaimsSettledAmount = 0;
    data.map((obj, index) => {
      if (!!obj.cashless) {
        cashlessReportedClaimsCount++;
        cashlessReportedClaimsAmount = (
          parseFloat(cashlessReportedClaimsAmount) +
          parseFloat(obj.initialEstimate)
        ).toFixed(2);
        cashlessReportedClaimsSettledAmount = (
          parseFloat(cashlessReportedClaimsAmount) +
          parseFloat(obj.amountSettled)
        ).toFixed(2);
      }

      if (!!obj.reimbursement) {
        reimbursementReportedClaimsCount++;
        reimbursementReportedClaimsAmount = (
          parseFloat(reimbursementReportedClaimsAmount) +
          parseFloat(obj.initialEstimate)
        ).toFixed(2);
        reimbursementReportedClaimsSettledAmount = (
          parseFloat(cashlessReportedClaimsAmount) +
          parseFloat(obj.amountSettled)
        ).toFixed(2);
      }
    });
    setCashlessReportedClaimsCount({
      noOfClaims: cashlessReportedClaimsCount,
      claimAmount: cashlessReportedClaimsAmount,
      settledAmount: cashlessReportedClaimsSettledAmount,
    });
    setReimbursementReportedClaimsCount({
      noOfClaims: reimbursementReportedClaimsCount,
      claimAmount: reimbursementReportedClaimsAmount,
      settledAmount: reimbursementReportedClaimsSettledAmount,
    });
  };

  const handleFromDateChange = (e) => {
    if (!!e) {
      setFromDate(e);
    }
  };
  const handleToDateChange = (e) => {
    if (!!e) {
      setToDate(e);
    }
  };

  const getClaimsReport = (e) => {
    let fromDateModify = MomentReg(fromDate, 'DD/MM/YYYY').format('DD/MM/YYYY');
    let toDateModify = MomentReg(toDate, 'DD/MM/YYYY').format('DD/MM/YYYY');
    ApiService.get(
      `${EMP_CONST.URL.exe_claimsAnalyticsReport}?corporateUuid=${corporateObj.uuid}&policyId=${policiesIdVal}&fromDate=${fromDateModify}&toDate=${toDateModify}`
    )
      .then((response) => {
        // console.log('response getPolicyReport ', response);
        if (typeof response !== 'undefined' && response.errCode === 'Success') {
          if (
            !!response.data &&
            Array.isArray(response.data) &&
            response.data.length > 0
          ) {
            setClaimsReportsData(response.data);
            collectClaimStatus(response.data);
            reportedDataCalc(response.data);
          } else {
            setClaimsReportsData([]);
            let respNotiObj = {
              message: response.message,
              color: 'error',
            };
            PubSub.publish(PubSub.events.SNACKBAR_PROVIDER, respNotiObj);
          }
        }
      })
      .catch((err) => {
        console.log(`Resend Error ${JSON.stringify(err)} `);
        if (!!err.data && (!!err.data.errCode || !!err.data.message)) {
          let respNotiObj = {
            message: err.data.message || err.data.errCode,
            color: 'error',
          };
          PubSub.publish(PubSub.events.SNACKBAR_PROVIDER, respNotiObj);
        }
      })
      .finally(() => {
        console.log(`Finally `);
      });
  };

  // const [totalReportedClaimAmount]
  const additionByParam = (a, b) => {
    return ((parseFloat(a) || 0) + (parseFloat(b) || 0)).toFixed(2);
  };
  const addingNofClaimsByStatusAndType = (status, type) => {
    let statusCount = 0;
    claimsReportsData.map((obj) => {
      if (!!obj[type] && obj.status === status) {
        statusCount++;
      }
    });
    return statusCount;
  };
  const addingAmountByStatusAndType = (status, type, amountType) => {
    let statusAmount = 0;
    claimsReportsData.map((obj) => {
      if (!!obj[type] && obj.status === status) {
        statusAmount = (
          parseFloat(statusAmount) + (parseFloat(obj[amountType]) || 0)
        ).toFixed(2);
      }
    });
    return statusAmount;
  };

  const exeClaimsReportTemplate = (
    <div className="hpr-policy-report-wrapper">
      {/* <pre>{JSON.stringify(cashlessReportedClaimsCount, null, 1)}</pre> */}
      {/* <pre>{JSON.stringify(reimbursementReportedClaimsCount, null, 1)}</pre> */}
      <div className="hpr_pageHeadingWrapper">
        <div className="hpr_page-heading-left-wrapper">
          {!!isMobile && (
            <div className="hpr-breadcrumb-wrapper">
              <Link to={'/executive-home/mis'}>
                <FontAwesomeIcon icon="chevron-left" className="mr-1" />
                Back
              </Link>
            </div>
          )}
          <h3 className="">Claims Report</h3>
        </div>
        <div className="hpr-flex-table-filter-sort-wrapper align-items-center employee-pending-filter-wrapper">
          <TextField
            id="corporateIdVal"
            label="Corporate"
            select
            type="text"
            value={corporateIdVal}
            onChange={handleChangeCorporate}
            size="small"
            className="status-select-wrapper"
            variant="outlined"
            className="hpr-pr-corporate-txt-wrapper"
          >
            {corporatesData.map((obj) => (
              <MenuItem key={obj} value={obj.companyName}>
                {CapitalizeFirstLetter(obj.companyName)}
              </MenuItem>
            ))}
          </TextField>

          {!!corporateIdVal && (
            <TextField
              id="policyId"
              label="Policy Id"
              select
              type="text"
              value={policiesIdVal}
              onChange={handleChangePolicyId}
              size="small"
              className="status-select-wrapper"
              variant="outlined"
              className="hpr-pr-policy-txt-wrapper"
            >
              {policiesData.map((obj) => (
                <MenuItem key={obj} value={obj.policyNumber}>
                  {CapitalizeFirstLetter(obj.policyNumber)}
                </MenuItem>
              ))}
            </TextField>
          )}

          <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <DatePicker
              inputVariant="outlined"
              autoOk
              label="From Date"
              disableFuture
              value={fromDate}
              onChange={handleFromDateChange}
              format="dd/MM/yyyy"
              animateYearScrolling
              className="hpr-pr-fDate-txt-wrapper"
              InputProps={{
                endAdornment: <FontAwesomeIcon icon="calendar-alt" />,
              }}
            />
            <DatePicker
              autoOk
              label="To Date"
              disableFuture
              value={toDate}
              onChange={handleToDateChange}
              format="dd/MM/yyyy"
              animateYearScrolling
              className="hpr-pr-tDate-txt-wrapper"
              InputProps={{
                endAdornment: <FontAwesomeIcon icon="calendar-alt" />,
              }}
              inputVariant="outlined"
            />
          </MuiPickersUtilsProvider>

          <Button
            disabled={!corporateIdVal || !policiesIdVal || !fromDate || !toDate}
            className="hpr-filter-sort-submit filter-go-btn hpr-pr-filter-go-btn"
            onClick={(e) => getClaimsReport(e)}
          >
            GO
          </Button>
        </div>
      </div>

      {!!claimsReportsData && Object.keys(claimsReportsData).length > 0 && (
        <div className="hpr-premium-reports-data-wrapper">
          <div className="hpr-prd-row mr-0">
            <div className="hpr-flex-table hpr-flex-table--collapse">
              <div className="hpr-flex-table-row hpr-flex-table-row--head hpr-flex-table-row--head-claims-report">
                <div
                  style={{ width: '10%' }}
                  className="hpr-flex-table-cell hpr-flex-table-column-heading"
                ></div>
                <div
                  style={{ width: '25%' }}
                  className="hpr-flex-table-cell hpr-flex-table-column-heading "
                >
                  <div className="hpr-head-claims-report-child">Cashless</div>
                  <div className="hpr-head-claims-report-child">
                    <div>No. Of Claims</div>
                    <div>Claim Amount</div>
                    <div>Settled Amount</div>
                  </div>
                </div>
                <div
                  style={{ width: '25%' }}
                  className="hpr-flex-table-cell hpr-flex-table-column-heading"
                >
                  <div className="hpr-head-claims-report-child">
                    Reimbursement
                  </div>
                  <div className="hpr-head-claims-report-child">
                    <div>No. Of Claims</div>
                    <div>Claim Amount</div>
                    <div>Settled Amount</div>
                  </div>
                </div>
                <div
                  style={{ width: '40%' }}
                  className="hpr-flex-table-cell hpr-flex-table-column-heading"
                >
                  <div className="hpr-head-claims-report-child">Total</div>
                  <div className="hpr-head-claims-report-child --total">
                    <div>Total Claims</div>
                    <div>Total Claim Amount</div>
                    <div>Total Settled Amount</div>
                    <div>% of Claims</div>
                    <div>% of Amount</div>
                  </div>
                </div>
              </div>

              <div className="hpr-flex-table-row">
                <div style={{ width: '10%' }} class="hpr-flex-table-cell">
                  <div className="hpr-flex-table-cell--content title-content">
                    Reported
                  </div>
                </div>

                <div
                  style={{ width: '25%' }}
                  className="hpr-claims-report-multy-col-wrapper"
                >
                  <div>{cashlessReportedClaimsCount.noOfClaims}</div>
                  <div>{cashlessReportedClaimsCount.claimAmount}</div>
                  <div>{cashlessReportedClaimsCount.settledAmount}</div>
                </div>
                <div
                  style={{ width: '25%' }}
                  className="hpr-claims-report-multy-col-wrapper"
                >
                  <div>{reimbursementReportedClaimsCount.noOfClaims}</div>
                  <div>{reimbursementReportedClaimsCount.claimAmount}</div>
                  <div>{reimbursementReportedClaimsCount.settledAmount}</div>
                </div>
                <div
                  style={{ width: '40%' }}
                  className="hpr-claims-report-multy-col-wrapper --total"
                >
                  <div>
                    {additionByParam(
                      cashlessReportedClaimsCount.noOfClaims,
                      reimbursementReportedClaimsCount.noOfClaims
                    )}
                  </div>
                  <div>
                    {additionByParam(
                      cashlessReportedClaimsCount.claimAmount,
                      reimbursementReportedClaimsCount.claimAmount
                    )}
                  </div>
                  <div>
                    {additionByParam(
                      cashlessReportedClaimsCount.settledAmount,
                      reimbursementReportedClaimsCount.settledAmount
                    )}
                  </div>
                  <div>{}</div>
                  <div>{}</div>
                </div>
              </div>

              {claimsReportsStatusStrings.map((val, index) => {
                let cashlessClaimsNo = addingNofClaimsByStatusAndType(
                  val,
                  'cashless'
                );
                let cashlessClaimsAmount = addingAmountByStatusAndType(
                  val,
                  'cashless',
                  'initialEstimate'
                );
                let cashlessClaimsSettleAmount = addingAmountByStatusAndType(
                  val,
                  'cashless',
                  'amountSettled'
                );
                let reimbursementClaimsNo = addingNofClaimsByStatusAndType(
                  val,
                  'reimbursement'
                );
                let reimbursementClaimsAmount = addingAmountByStatusAndType(
                  val,
                  'reimbursement',
                  'initialEstimate'
                );
                let reimbursementClaimsSettleAmount = addingAmountByStatusAndType(
                  val,
                  'reimbursement',
                  'amountSettled'
                );
                let totalNoOfClaims = (
                  parseFloat(cashlessClaimsNo) +
                  parseFloat(reimbursementClaimsNo)
                ).toFixed(2);
                let totalClaimsAmount = (
                  parseFloat(cashlessClaimsAmount) ||
                  0 + parseFloat(reimbursementClaimsAmount) ||
                  0
                ).toFixed(2);
                let totalClaimsSettleAmount = (
                  parseFloat(cashlessClaimsSettleAmount) ||
                  0 + parseFloat(reimbursementClaimsSettleAmount) ||
                  0
                ).toFixed(2);
                let percentClaims = (
                  (totalNoOfClaims /
                    additionByParam(
                      cashlessReportedClaimsCount.noOfClaims,
                      reimbursementReportedClaimsCount.noOfClaims
                    )) *
                  100
                ).toFixed(2);

                let percentAmount = (
                  (totalClaimsSettleAmount /
                    additionByParam(
                      cashlessReportedClaimsCount.settledAmount,
                      reimbursementReportedClaimsCount.settledAmount
                    )) *
                  100
                ).toFixed(2);
                return (
                  <div className="hpr-flex-table-row">
                    <div style={{ width: '10%' }} class="hpr-flex-table-cell">
                      <div className="hpr-flex-table-cell--content title-content">
                        {val}
                      </div>
                    </div>
                    <div
                      style={{ width: '25%' }}
                      className="hpr-claims-report-multy-col-wrapper"
                    >
                      <div>{cashlessClaimsNo}</div>
                      <div>{cashlessClaimsAmount}</div>
                      <div>{cashlessClaimsSettleAmount}</div>
                    </div>

                    <div
                      style={{ width: '25%' }}
                      className="hpr-claims-report-multy-col-wrapper"
                    >
                      <div>{reimbursementClaimsNo}</div>
                      <div>{reimbursementClaimsAmount}</div>
                      <div>{reimbursementClaimsSettleAmount}</div>
                    </div>

                    <div
                      style={{ width: '40%' }}
                      className="hpr-claims-report-multy-col-wrapper --total"
                    >
                      <div>{totalNoOfClaims}</div>
                      <div>{totalClaimsAmount}</div>
                      <div>{totalClaimsSettleAmount}</div>
                      <div>{percentClaims}</div>
                      <div>{percentAmount}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );

  return exeClaimsReportTemplate;
});

export default ExeClaimsReport;
