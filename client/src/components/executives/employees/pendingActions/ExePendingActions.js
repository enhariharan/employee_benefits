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

import { Alert, AlertTitle } from '@material-ui/lab';

import { CSVLink } from 'react-csv';

import update from 'immutability-helper';

import { Button } from '@material-ui/core';
import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';

import { PubSub } from '../../../../services/PubSub';
import ApiService from '../../../../services/ApiService';
import { EMP_CONST } from '../../../../services/Constants';
import { AuthContext } from '../../../../context/AuthContext';
import { GlobalDataContext } from '../../../../context/GlobalDataContext';

import PendingApprovals from '../../../commonPages/pendingApprovals/PendingApprovals';

import {
  CapitalizeFirstLetter,
  uniqueCorporateObject,
  _employeeStatus,
  _approvalType,
} from '../../../../reUseComponents/utils/utils';

import './exePendingActions.scss';

const ExePendingActions = React.memo((props) => {
  const [globalOnLoadData, setGlobalOnLoadData] = useContext(GlobalDataContext);

  const [currentUser] = useContext(AuthContext);

  let isGlobalPendingActionData;
  !!globalOnLoadData &&
  Object.keys(globalOnLoadData).length > 0 &&
  !!globalOnLoadData.pendingActionsData
    ? (isGlobalPendingActionData = true)
    : (isGlobalPendingActionData = false);

  let isGlobalData;
  !!globalOnLoadData &&
  Object.keys(globalOnLoadData).length > 0 &&
  !!globalOnLoadData.exePendingCust
    ? (isGlobalData = true)
    : (isGlobalData = false);

  let isGlobalCorporateData;
  !!globalOnLoadData &&
  Object.keys(globalOnLoadData).length > 0 &&
  !!globalOnLoadData.corporatesData
    ? (isGlobalCorporateData = true)
    : (isGlobalCorporateData = false);

  //   console.log('ExePendingActions props ', props);
  const [isMobile, setIsMobile] = useState(null);
  const [isClickGo, setIsClickGo] = useState(false);
  const [pendingCustomers, setPendingCustomers] = useState(
    (!!isGlobalData && globalOnLoadData.exePendingCust) || []
  );
  useEffect(() => {
    if (!!globalOnLoadData.selectedCorporate) {
      getPendingApprovalsByStatus('', globalOnLoadData.selectedCorporate.uuid);
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

  const getPendingApprovalsByStatus = (e, corpUuid) => {
    const corporateUuid = corpUuid || corporateObj.uuid;
    const defaultStatus = currentStatus || 'all';
    // const defaultApprovalType = approvalType || 'addition';

    if (!corporateUuid) {
      return;
    }

    let dynamicURL = `${EMP_CONST.URL.exe_createCustomers}`;

    if (!!employeeType && employeeType.toLowerCase() === 'dependant') {
      dynamicURL = `${dynamicURL}/dependents/list?status=${defaultStatus}&corporateUuid=${corporateUuid}`;
    } else {
      dynamicURL = `${dynamicURL}?status=${defaultStatus}&corporateUuid=${corporateUuid}`;
    }

    ApiService.get(dynamicURL)
      .then((response) => {
        if (typeof response !== 'undefined') {
          let fieldsArray = [
            {
              ...corporateObj,
              corporateIdVal: corporateIdVal,
              currentStatus: currentStatus,
              // approvalType: approvalType,
              employeeType: employeeType,
            },
          ];

          const newGlobalOnLoadData = update(globalOnLoadData, {
            ['exePendingCust']: {
              $set: response.data,
            },
            ['exePendingCustFields']: { $set: fieldsArray },
          });
          setGlobalOnLoadData(newGlobalOnLoadData);
          setIsClickGo(true);
          setPendingCustomers(response.data);
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
    }
  };

  const [currentStatus, setCurrentStatus] = useState(
    (!!isGlobalData &&
      globalOnLoadData.exePendingCustFields[0].currentStatus) ||
      ''
  );
  const handleChangeStatus = (e) => {
    if (!!e.target.value) {
      setCurrentStatus(e.target.value);
    }
  };

  // const [approvalType, setApprovalType] = useState(
  //   (!!isGlobalData && globalOnLoadData.exePendingCustFields[0].approvalType) ||
  //     ''
  // );
  // const handleChangeAtype = (e) => {
  //   if (!!e.target.value) {
  //     setApprovalType(e.target.value);
  //   }
  // };

  const [employeeType, setEmployeeType] = useState(
    (!!isGlobalData && globalOnLoadData.exePendingCustFields[0].employeeType) ||
      ''
  );
  const handleChangeEmpType = (e) => {
    if (!!e.target.value) {
      setEmployeeType(e.target.value);
      if (!!isClickGo) {
        setIsClickGo(!isClickGo);
      }
    }
  };

  const viewDetailsData = {
    pageHeading: 'View Details',
    type: employeeType,
    isClickGo: isClickGo,
    corporateObj: corporateObj,
    detailsPath: '/executive-home/employees/pending-actions',
  };

  const exePendingActionsTemplate = (
    <Fragment>
      {/* <pre>{JSON.stringify(globalOnLoadData, null, 1)}</pre> */}
      {!!isGlobalPendingActionData && (
        <Alert
          className="hpr-alert-wrapper hpr-alert-pending-actions mt-1 mb-3"
          severity="error"
        >
          <div className="hpr-alert-id-wrapper">
            <div className="hpr-alert-id-elem">
              Customer Pending Actions :{' '}
              <span className="hpr-alert-pa-number">
                {globalOnLoadData.pendingActionsData.employeeActions}
              </span>
            </div>
            <div className="hpr-alert-id-elem">
              Dependent Pending Actions :{' '}
              <span className="hpr-alert-pa-number">
                {globalOnLoadData.pendingActionsData.dependentsActions}
              </span>
            </div>
            <div className="hpr-alert-id-elem">
              Policicy Pending Actions :{' '}
              <span className="hpr-alert-pa-number">
                {globalOnLoadData.pendingActionsData.policyActions}
              </span>
            </div>
          </div>
        </Alert>
      )}
      <div className="hpr_pageHeadingWrapper">
        <div className="hpr_page-heading-left-wrapper">
          {!!isMobile && (
            <div className="hpr-breadcrumb-wrapper">
              <Link to={'/hr-home/employees'}>
                <FontAwesomeIcon icon="chevron-left" className="mr-1" />
                Back
              </Link>
            </div>
          )}
          <h3 className="">Pending Actions</h3>
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
            className="exe-pa-select-corporate-wrapper"
            variant="outlined"
          >
            {corporatesData.map((obj) => (
              <MenuItem key={obj} value={obj.companyName}>
                {CapitalizeFirstLetter(obj.companyName)}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            id="employeeType"
            label="Type"
            select
            type="text"
            value={employeeType}
            onChange={handleChangeEmpType}
            size="small"
            className="exe-pa-select-emp-type-wrapper"
            variant="outlined"
          >
            {EMP_CONST.EMPOYEE_TYPE.map((emp) => (
              <MenuItem key={emp} value={emp}>
                {emp}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            id="currentStatus"
            label="Status"
            select
            type="text"
            value={currentStatus}
            onChange={handleChangeStatus}
            size="small"
            className="exe-pa-select-status-wrapper"
            variant="outlined"
          >
            {_employeeStatus.map((obj) => {
              return currentUser.role === 'manager'
                ? (obj.toLowerCase() === 'all' ||
                    obj.toLowerCase() === 'created' ||
                    obj.toLowerCase() === 'resigned') && (
                    <MenuItem key={obj} value={obj}>
                      {CapitalizeFirstLetter(obj)}
                    </MenuItem>
                  )
                : obj.toLowerCase() === 'pending insurer approval' && (
                    <MenuItem key={obj} value={obj}>
                      {CapitalizeFirstLetter(obj)}
                    </MenuItem>
                  );
            })}
          </TextField>
          {/* <TextField
            id="approvalType"
            label="Approval type"
            select
            type="text"
            value={approvalType}
            size="small"
            onChange={handleChangeAtype}
            className="exe-pa-select-approve-wrapper"
            variant="outlined"
          >
            {_approvalType.map((obj) => (
              <MenuItem key={obj} value={obj}>
                {CapitalizeFirstLetter(obj)}
              </MenuItem>
            ))}
          </TextField> */}
          <Button
            disabled={!currentStatus || !corporateIdVal}
            className="hpr-filter-sort-submit filter-go-btn"
            onClick={(e) => getPendingApprovalsByStatus(e, corporateObj.uuid)}
          >
            GO
          </Button>

          {!!pendingCustomers && pendingCustomers.length > 0 && (
            <CSVLink
              data={pendingCustomers}
              filename={
                employeeType.toLowerCase() ===
                EMP_CONST.EMPOYEE_TYPE[0].toLowerCase()
                  ? `listOfEmp_${corporateIdVal}.csv`
                  : `listOfDep_${corporateIdVal}.csv`
              }
              className="hpr-anchor-text"
            >
              <Button className="hpr-download-template-wrapper ml-3">
                <FontAwesomeIcon icon="upload" className="mr-2" /> Export CSV
              </Button>
            </CSVLink>
          )}
        </div>
      </div>

      <div className="row">
        <div className="col-12">
          {!!pendingCustomers && (
            <PendingApprovals
              flexTableArray={pendingCustomers}
              data={viewDetailsData}
            />
          )}
        </div>
      </div>
    </Fragment>
  );

  return exePendingActionsTemplate;
});

export default ExePendingActions;
