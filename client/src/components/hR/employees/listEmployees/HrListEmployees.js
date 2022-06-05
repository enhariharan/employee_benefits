import React, { Fragment, useContext, useState, useEffect } from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './hrListEmployees.scss';
import {
  BrowserRouter as Router,
  Route,
  Redirect,
  Switch,
  Link,
  useHistory,
} from 'react-router-dom';

import { Button } from '@material-ui/core';
import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';
import InputAdornment from '@material-ui/core/InputAdornment';
import IconButton from '@material-ui/core/IconButton';
import { Alert, AlertTitle } from '@material-ui/lab';

import {
  CapitalizeFirstLetter,
  _employeeStatus,
} from '../../../../reUseComponents/utils/utils';

import { PubSub } from '../../../../services/PubSub';
import ApiService from '../../../../services/ApiService';
import { EMP_CONST } from '../../../../services/Constants';
import { AuthContext } from '../../../../context/AuthContext';
import { GlobalDataContext } from '../../../../context/GlobalDataContext';

import GetAllEmployees from '../../../commonPages/getAllEmployees/GetAllEmployees';

import update from 'immutability-helper';
import { CSVLink } from 'react-csv';

const HrListEmployees = React.memo((props) => {
  // console.log('ListEmployees props ', props);
  const [isMobile, setIsMobile] = useState(null);
  const [listEmployeeData, setListEmployeeData] = useState([]);
  const [currentUser] = useContext(AuthContext);

  const history = useHistory();

  const [globalOnLoadData, setGlobalOnLoadData] = useContext(GlobalDataContext);

  let isGlobalData;
  !!globalOnLoadData &&
  Object.keys(globalOnLoadData).length > 0 &&
  !!globalOnLoadData.hrEmpList
    ? (isGlobalData = true)
    : (isGlobalData = false);

  useEffect(() => {
    getListEmployees();
    PubSub.subscribe(PubSub.events.IS_MOBILE, (flag) => {
      setIsMobile(flag);
    });
    return () => {
      PubSub.unsubscribe(PubSub.events.IS_MOBILE);
    };
  }, []);

  const searchEmployee = () => {
    if (!!employeeIdTxt) {
      ApiService.get(`${EMP_CONST.URL.exe_createCustomers}/${employeeIdTxt}`)
        .then((response) => {
          // console.log('response getPendingApprovalsByStatus ', response);
          if (typeof response !== 'undefined' && !!response.data) {
            setListEmployeeData([response.data]);
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
    }
  };

  const getListEmployees = () => {
    if (currentUser === null) {
      return;
    }

    let dynamicURL;
    if (
      !!history &&
      !!history.location &&
      !!history.location.bulkUploadObj &&
      Object.keys(history.location.bulkUploadObj).length > 0
    ) {
      setCurrentStatus(_employeeStatus[0]);
      if (!!history.location.bulkUploadObj.isDependant) {
        dynamicURL = `${EMP_CONST.URL.exe_createCustomers}/dependents/list?status=all&corporateUuid=${currentUser.corporateUuid}`;
        setEmployeeType(EMP_CONST.EMPOYEE_TYPE[1]);
      } else {
        dynamicURL = `${EMP_CONST.URL.exe_createCustomers}?corporateUuid=${currentUser.corporateUuid}&status=all`;
        setEmployeeType(EMP_CONST.EMPOYEE_TYPE[0]);
      }
    } else {
      if (
        employeeType.toLowerCase() === EMP_CONST.EMPOYEE_TYPE[0].toLowerCase()
      ) {
        dynamicURL = `${EMP_CONST.URL.exe_createCustomers}?corporateUuid=${currentUser.corporateUuid}&status=${currentStatus}`;
      }
      if (
        employeeType.toLowerCase() === EMP_CONST.EMPOYEE_TYPE[1].toLowerCase()
      ) {
        dynamicURL = `${EMP_CONST.URL.exe_createCustomers}/dependents/list?status=${currentStatus}&corporateUuid=${currentUser.corporateUuid}`;
      }
    }

    let fieldsArray = [
      {
        currentStatus: currentStatus,
        employeeType: employeeType,
      },
    ];

    // let dynamicURL = `${EMP_CONST.URL.exe_createCustomers}`;
    // if (!!currentStatus) {
    //   dynamicURL = `${dynamicURL}?corporateUuid=${currentUser.uuid}&status=${currentStatus}`;
    // }

    ApiService.get(dynamicURL)
      .then((response) => {
        // console.log('response getListEmployees ', response);
        if (typeof response !== 'undefined' && !!response.data) {
          const newGlobalOnLoadData = update(globalOnLoadData, {
            ['hrEmpList']: {
              $set: response.data,
            },
            ['hrEmpListFields']: { $set: fieldsArray },
          });
          setGlobalOnLoadData(newGlobalOnLoadData);
          setListEmployeeData(response.data);
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

  const [employeeIdTxt, setEmployeeIdTxt] = useState('');
  const [currentStatus, setCurrentStatus] = useState(
    (!!isGlobalData && globalOnLoadData.hrEmpListFields[0].currentStatus) || ''
  );

  const handleChangeEmpId = (e) => {
    setEmployeeIdTxt(e.target.value);
  };

  const handleChangeStatus = (e) => {
    if (!!e.target.value) {
      setCurrentStatus(e.target.value);
    }
  };

  const [employeeType, setEmployeeType] = useState(
    (!!isGlobalData && globalOnLoadData.hrEmpListFields[0].employeeType) ||
      EMP_CONST.EMPOYEE_TYPE[0]
  );
  const handleChangeEmpType = (e) => {
    if (!!e.target.value) {
      setEmployeeType(e.target.value);
    }
  };

  const viewDetailsData = {
    pageHeading: 'View Details',
    detailsPath: '/hr-home/employees/list-employees',
    viewDepsPath: '/hr-home/employees',
    corporateUuid: !!currentUser ? currentUser.corporateUuid : '',
    currentUser: !!currentUser ? currentUser : '',
    isSelectCustomer:
      !!employeeType &&
      employeeType.toLowerCase() === EMP_CONST.EMPOYEE_TYPE[0].toLowerCase()
        ? true
        : false,
  };

  const closeAlert = () => {
    props.history.replace({ state: null });
  };

  const hrListEmployeesTemplate = (
    <Fragment>
      {!!props.location.state &&
        !!props.location.state.failedDependents &&
        props.location.state.failedDependents.length > 0 && (
          <Alert className="hpr-alert-wrapper mt-1 mb-3" severity="error">
            <AlertTitle className="hpr-alert-title">
              Following Employee ID's are do not exists.
            </AlertTitle>
            <FontAwesomeIcon
              onClick={closeAlert}
              icon="times-circle"
              className="hpr-alert-close"
            />
            <div className="hpr-alert-id-wrapper">
              {props.location.state.failedDependents.map((val, index) => (
                <div className="hpr-alert-id-elem">{val.empid}</div>
              ))}
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
          <h3 className="">List Employees</h3>
        </div>

        <div className="hpr-flex-table-filter-sort-wrapper align-items-center employee-pending-filter-wrapper hr-employee-get-list-filter-wrapper">
          <TextField
            id="employeeType"
            label="Type"
            select
            type="text"
            value={employeeType}
            onChange={handleChangeEmpType}
            size="small"
            className="hrgl-emp-type-select-wrapper"
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
            {_employeeStatus.map((obj) => (
              <MenuItem key={obj} value={obj}>
                {CapitalizeFirstLetter(obj)}
              </MenuItem>
            ))}
          </TextField>

          <Button
            disabled={!currentStatus || !employeeType}
            className="hpr-filter-sort-submit filter-go-btn"
            onClick={getListEmployees}
          >
            GO
          </Button>

          <TextField
            id="currentStatus"
            label="Employee Id"
            type="text"
            value={employeeIdTxt}
            onChange={handleChangeEmpId}
            size="small"
            className="emp-id-text-wrapper ml-4"
            variant="outlined"
            InputProps={{
              endAdornment: (
                <InputAdornment
                  position="end"
                  className="input-adornment-custom-wrapper"
                  onClick={searchEmployee}
                >
                  <IconButton disabled={!employeeIdTxt}>
                    <FontAwesomeIcon icon="search" />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          ></TextField>

          {!!listEmployeeData && listEmployeeData.length > 0 && (
            <CSVLink
              data={listEmployeeData}
              filename={
                employeeType.toLowerCase() ===
                EMP_CONST.EMPOYEE_TYPE[0].toLowerCase()
                  ? `listOfEmp.csv`
                  : `listOfDep.csv`
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
          {!!listEmployeeData && (
            <GetAllEmployees
              flexTableArray={listEmployeeData}
              data={viewDetailsData}
            />
          )}
        </div>
      </div>
    </Fragment>
  );

  return hrListEmployeesTemplate;
});

export default HrListEmployees;
