import React, { Fragment, useContext, useState, useEffect } from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { BrowserRouter as Router, Link } from 'react-router-dom';

import './hrPendingApprovals.scss';

import { Alert, AlertTitle } from '@material-ui/lab';

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
  _employeeStatus,
} from '../../../../reUseComponents/utils/utils';

const HrPendingApprovals = React.memo((props) => {
  // console.log('HrPendingApprovals props ', props);
  const [globalOnLoadData, setGlobalOnLoadData] = useContext(GlobalDataContext);
  const [isMobile, setIsMobile] = useState(null);
  const [isClickGo, setIsClickGo] = useState(false);
  const [pendingCustomers, setPendingCustomers] = useState([]);
  const [currentUser] = useContext(AuthContext);

  let isGlobalData;
  !!globalOnLoadData &&
  Object.keys(globalOnLoadData).length > 0 &&
  !!globalOnLoadData.pendingActionsData
    ? (isGlobalData = true)
    : (isGlobalData = false);

  useEffect(() => {
    getPendingApprovalsByStatus();
    PubSub.subscribe(PubSub.events.IS_MOBILE, (flag) => {
      setIsMobile(flag);
    });
    return () => {
      PubSub.unsubscribe(PubSub.events.IS_MOBILE);
    };
  }, []);

  const getPendingApprovalsByStatus = () => {
    const corporateUuid = currentUser.corporateUuid;
    const defaultStatus = currentStatus || 'created';
    const defaultApprovalType = 'addition';

    if (currentUser === null) {
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
        // console.log('response getPendingApprovalsByStatus ', response);
        if (typeof response !== 'undefined') {
          setPendingCustomers(response.data);
          setIsClickGo(true);
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

  const [currentStatus, setCurrentStatus] = useState('created');

  const [employeeType, setEmployeeType] = useState('Employee');
  const handleChangeEmpType = (e) => {
    if (!!e.target.value) {
      setEmployeeType(e.target.value);
      if (!!isClickGo) {
        setIsClickGo(!isClickGo);
      }
    }
  };

  const handleChangeStatus = (e) => {
    if (!!e.target.value) {
      setCurrentStatus(e.target.value);
    }
  };

  const viewDetailsData = {
    pageHeading: 'View Details',
    type: employeeType,
    isClickGo: isClickGo,
    detailsPath: '/hr-home/employees/pending-actions',
    editEmployeePath: '/hr-home/employees/edit-employee',
    editDependantPath: `/hr-home/employees`,
  };

  const hrPendingApprovalsTemplate = (
    <Fragment>
      {/* <pre>{JSON.stringify(globalOnLoadData)}</pre> */}
      {!!isGlobalData && (
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
            className="status-select-wrapper"
            variant="outlined"
          >
            {_employeeStatus.map(
              (obj) =>
                (obj.toLowerCase() === 'all' ||
                  obj.toLowerCase() === 'created' ||
                  obj.toLowerCase() === 'resigned') && (
                  <MenuItem key={obj} value={obj}>
                    {CapitalizeFirstLetter(obj)}
                  </MenuItem>
                )
            )}
          </TextField>

          <Button
            disabled={!currentStatus}
            className="hpr-filter-sort-submit filter-go-btn"
            onClick={getPendingApprovalsByStatus}
          >
            GO
          </Button>
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

  return hrPendingApprovalsTemplate;
});

export default HrPendingApprovals;
