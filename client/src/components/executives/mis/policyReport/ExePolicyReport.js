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

import './exePolicyReport.scss';

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
} from '../../../../reUseComponents/utils/utils';

const ExePolicyReport = React.memo((props) => {
  const [globalOnLoadData, setGlobalOnLoadData] = useContext(GlobalDataContext);
  // console.log('ExePolicyReport props ', props);

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

  const [fromDate, setFromDate] = useState(new Date());
  const [toDate, setToDate] = useState(new Date());
  const [premiumReportsData, setPremiumReportsData] = useState({});

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

  const getPolicyReport = (e) => {
    let fromDateModify = MomentReg(fromDate, 'DD/MM/YYYY').format('DD/MM/YYYY');
    let toDateModify = MomentReg(toDate, 'DD/MM/YYYY').format('DD/MM/YYYY');
    ApiService.get(
      `${EMP_CONST.URL.exe_policyReport}?corporateUuid=${corporateObj.uuid}&policyId=${policiesIdVal}&fromDate=${fromDateModify}&toDate=${toDateModify}`
    )
      .then((response) => {
        // console.log('response getPolicyReport ', response);
        if (typeof response !== 'undefined' && response.errCode === 'Success') {
          if (!!response.data && typeof response.data === 'object') {
            setPremiumReportsData(response.data);
          } else {
            setPremiumReportsData({});
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

  const exePolicyReportTemplate = (
    <div className="hpr-policy-report-wrapper">
      <div className="hpr_pageHeadingWrapper">
        <div className="hpr_page-heading-left-wrapper">
          <div className="hpr-breadcrumb-wrapper">
            <Link to={'/executive-home/mis'}>
              <FontAwesomeIcon icon="chevron-left" className="mr-1" />
              Back
            </Link>
          </div>
          <h3 className="">Premium Report</h3>
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
            onClick={(e) => getPolicyReport(e)}
          >
            GO
          </Button>
        </div>
      </div>

      <div className="row">
        <div className="col-12">
          {!!premiumReportsData && Object.keys(premiumReportsData).length > 0 && (
            <div className="hpr-premium-reports-data-wrapper">
              {/* While Intail member object is available */}
              {!!premiumReportsData.initial &&
                Object.keys(premiumReportsData.initial).length > 0 && (
                  <div className="hpr-prd-row">
                    <div className="hpr-flex-table hpr-flex-table--collapse">
                      <div className="hpr-flex-table-row hpr-flex-table-row--head">
                        <div
                          style={{ width: '15%' }}
                          className="hpr-flex-table-cell hpr-flex-table-column-heading"
                        >
                          Intial Members
                        </div>
                      </div>

                      {Object.keys(premiumReportsData.initial).map(function (
                        key,
                        index
                      ) {
                        return (
                          <div className="hpr-flex-table-row">
                            <div class="hpr-flex-table-cell justify-content-between">
                              <div className="hpr-flex-table-cell--heading">
                                Intial Members
                              </div>
                              <div className="hpr-flex-table-cell--content title-content">
                                {underscoreToSpaceText(key)}
                              </div>
                              <div className="hpr-flex-table-cell--content title-content">
                                {premiumReportsData.initial[key]}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

              {/* While additions member object is available */}
              {!!premiumReportsData.additions &&
                Object.keys(premiumReportsData.additions).length > 0 && (
                  <div className="hpr-prd-row">
                    <div className="hpr-flex-table hpr-flex-table--collapse">
                      <div className="hpr-flex-table-row hpr-flex-table-row--head">
                        <div
                          style={{ width: '15%' }}
                          className="hpr-flex-table-cell hpr-flex-table-column-heading"
                        >
                          Addition Members
                        </div>
                      </div>

                      {Object.keys(premiumReportsData.additions).map(function (
                        key,
                        index
                      ) {
                        return (
                          <div className="hpr-flex-table-row">
                            <div class="hpr-flex-table-cell justify-content-between">
                              <div className="hpr-flex-table-cell--heading">
                                Addition Members
                              </div>
                              <div className="hpr-flex-table-cell--content title-content">
                                {underscoreToSpaceText(key)}
                              </div>
                              <div className="hpr-flex-table-cell--content title-content">
                                {premiumReportsData.additions[key]}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

              {/* While deletion member object is available */}
              {!!premiumReportsData.deletions &&
                Object.keys(premiumReportsData.deletions).length > 0 && (
                  <div className="hpr-prd-row">
                    <div className="hpr-flex-table hpr-flex-table--collapse">
                      <div className="hpr-flex-table-row hpr-flex-table-row--head">
                        <div
                          style={{ width: '15%' }}
                          className="hpr-flex-table-cell hpr-flex-table-column-heading"
                        >
                          Deletion Members
                        </div>
                      </div>

                      {Object.keys(premiumReportsData.deletions).map(function (
                        key,
                        index
                      ) {
                        return (
                          <div className="hpr-flex-table-row">
                            <div class="hpr-flex-table-cell justify-content-between">
                              <div className="hpr-flex-table-cell--heading">
                                Deletion Members
                              </div>
                              <div className="hpr-flex-table-cell--content title-content">
                                {underscoreToSpaceText(key)}
                              </div>
                              <div className="hpr-flex-table-cell--content title-content">
                                {premiumReportsData.deletions[key]}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

              {/* While Current member object is available */}
              {!!premiumReportsData.current &&
                Object.keys(premiumReportsData.current).length > 0 && (
                  <div className="hpr-prd-row">
                    <div className="hpr-flex-table hpr-flex-table--collapse">
                      <div className="hpr-flex-table-row hpr-flex-table-row--head">
                        <div
                          style={{ width: '15%' }}
                          className="hpr-flex-table-cell hpr-flex-table-column-heading"
                        >
                          Current Members
                        </div>
                      </div>

                      {Object.keys(premiumReportsData.current).map(function (
                        key,
                        index
                      ) {
                        return (
                          <div className="hpr-flex-table-row">
                            <div class="hpr-flex-table-cell justify-content-between">
                              <div className="hpr-flex-table-cell--heading">
                                Current Members
                              </div>
                              <div className="hpr-flex-table-cell--content title-content">
                                {underscoreToSpaceText(key)}
                              </div>
                              <div className="hpr-flex-table-cell--content title-content">
                                {premiumReportsData.current[key]}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

              {/* While premium object is available */}
              {!!premiumReportsData.premium &&
                Object.keys(premiumReportsData.premium).length > 0 && (
                  <div className="hpr-prd-row">
                    <div className="hpr-flex-table hpr-flex-table--collapse">
                      <div className="hpr-flex-table-row hpr-flex-table-row--head">
                        <div
                          style={{ width: '15%' }}
                          className="hpr-flex-table-cell hpr-flex-table-column-heading"
                        >
                          Premium Details
                        </div>
                      </div>

                      {Object.keys(premiumReportsData.premium).map(function (
                        key,
                        index
                      ) {
                        return (
                          <div className="hpr-flex-table-row">
                            <div class="hpr-flex-table-cell justify-content-between">
                              <div className="hpr-flex-table-cell--heading">
                                Premium Details
                              </div>
                              <div className="hpr-flex-table-cell--content title-content">
                                {underscoreToSpaceText(key)}
                              </div>
                              <div className="hpr-flex-table-cell--content title-content">
                                {premiumReportsData.premium[key] === 0 ? (
                                  ''
                                ) : (
                                  <FontAwesomeIcon
                                    icon="rupee-sign"
                                    className="mr-1 hpr-rupee-sym-mis-table"
                                  />
                                )}
                                {premiumReportsData.premium[key]}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return exePolicyReportTemplate;
});

export default ExePolicyReport;
