import React, { Fragment, useContext, useState, useEffect } from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './executiveListEmployee.scss';

import { CSVLink } from 'react-csv';

import {
  BrowserRouter as Router,
  Route,
  Redirect,
  Switch,
  Link,
  useHistory,
} from 'react-router-dom';

import update from 'immutability-helper';

import { Button } from '@material-ui/core';
import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';
import InputAdornment from '@material-ui/core/InputAdornment';
import IconButton from '@material-ui/core/IconButton';
import { Alert, AlertTitle } from '@material-ui/lab';

import { PubSub } from '../../../../services/PubSub';
import ApiService from '../../../../services/ApiService';
import { EMP_CONST } from '../../../../services/Constants';
import { AuthContext } from '../../../../context/AuthContext';
import { GlobalDataContext } from '../../../../context/GlobalDataContext';

import {
  CapitalizeFirstLetter,
  _employeeStatus,
  uniqueCorporateObject,
} from '../../../../reUseComponents/utils/utils';

import GetAllEmployees from '../../../commonPages/getAllEmployees/GetAllEmployees';

const ExecutiveListEmployee = React.memo((props) => {
  const [globalOnLoadData, setGlobalOnLoadData] = useContext(GlobalDataContext);
  // console.log('ExecutiveListEmployee props ', props);

  const history = useHistory();

  let isGlobalData;
  !!globalOnLoadData &&
  Object.keys(globalOnLoadData).length > 0 &&
  !!globalOnLoadData.exeEmpList
    ? (isGlobalData = true)
    : (isGlobalData = false);

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

  const [employeesData, setEmployeesData] = useState([]);
  const [employeeTypeAfterResults, setEmployeeTypeAfterResults] = useState('');
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
    }
  };
  useEffect(() => {
    if (!!globalOnLoadData.selectedCorporate) {
      getAllEmployeesByCorID('', globalOnLoadData.selectedCorporate.uuid);
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

  const getAllEmployeesByCorID = (e, corpUuid) => {
    const corporateUuid = corpUuid || corporateObj.uuid;
    if (!corporateUuid) {
      return;
    }

    let dynamicURL;

    if (
      !!history &&
      !!history.location &&
      !!history.location.bulkUploadObj &&
      Object.keys(history.location.bulkUploadObj).length > 0 &&
      !isEmpTypeMod
    ) {
      setCurrentStatus(_employeeStatus[0]);
      if (!!history.location.bulkUploadObj.isDependant) {
        dynamicURL = `${EMP_CONST.URL.exe_createCustomers}/dependents/list?status=all&corporateUuid=${corporateUuid}`;
        setEmployeeType(EMP_CONST.EMPOYEE_TYPE[1]);
      } else {
        dynamicURL = `${EMP_CONST.URL.exe_createCustomers}?corporateUuid=${corporateUuid}&status=all`;
        setEmployeeType(EMP_CONST.EMPOYEE_TYPE[0]);
      }
    } else {
      if (
        employeeType.toLowerCase() === EMP_CONST.EMPOYEE_TYPE[0].toLowerCase()
      ) {
        dynamicURL = `${EMP_CONST.URL.exe_createCustomers}?corporateUuid=${corporateUuid}&status=${currentStatus}`;
      }
      if (
        employeeType.toLowerCase() === EMP_CONST.EMPOYEE_TYPE[1].toLowerCase()
      ) {
        dynamicURL = `${EMP_CONST.URL.exe_createCustomers}/dependents/list?status=${currentStatus}&corporateUuid=${corporateUuid}`;
      }
    }

    let fieldsArray = [
      {
        ...corporateObj,
        corporateIdVal: corporateIdVal,
        currentStatus: currentStatus,
        employeeType: employeeType,
      },
    ];

    ApiService.get(dynamicURL)
      .then((response) => {
        // console.log('response getAllEmployeesByCorID ', response);
        if (typeof response !== 'undefined') {
          const newGlobalOnLoadData = update(globalOnLoadData, {
            ['exeEmpList']: {
              $set: response.data,
            },
            ['exeEmpListFields']: { $set: fieldsArray },
          });
          setGlobalOnLoadData(newGlobalOnLoadData);
          setEmployeesData(response.data);
          setEmployeeTypeAfterResults(employeeType);
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
    (!!isGlobalData && globalOnLoadData.exeEmpListFields[0].currentStatus) || ''
  );

  const handleChangeEmpId = (e) => {
    setEmployeeIdTxt(e.target.value);
  };

  const handleChangeStatus = (e) => {
    if (!!e.target.value) {
      setCurrentStatus(e.target.value);
    }
  };

  const [isEmpTypeMod, setIsEmpTypeMod] = useState(false);
  const [employeeType, setEmployeeType] = useState(
    (!!isGlobalData && globalOnLoadData.exeEmpListFields[0].employeeType) || ''
  );
  const handleChangeEmpType = (e) => {
    if (!!e.target.value) {
      setEmployeeType(e.target.value);
      setIsEmpTypeMod(true);
    }
  };

  const searchEmployee = () => {
    if (!employeeIdTxt) {
      return;
    }
    ApiService.get(`${EMP_CONST.URL.exe_createCustomers}/${employeeIdTxt}`)
      .then((response) => {
        // console.log('response getPendingApprovalsByStatus ', response);
        if (typeof response !== 'undefined' && !!response.data) {
          setEmployeesData([response.data]);
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

  const searchEmployeeKeyDown = (e) => {
    if (e.key === 'Enter') {
      searchEmployee();
    }
  };

  const viewDetailsData = {
    pageHeading: 'View Details',
    detailsPath: '/executive-home/employees/list-employees',
    viewDepsPath: '/executive-home/employees',
    corporateUuid: !!globalOnLoadData.selectedCorporate
      ? globalOnLoadData.selectedCorporate.uuid
      : '',
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

  const executiveListEmployeeTemplate = (
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
              <Link to={'/executive-home/employees'}>
                <FontAwesomeIcon icon="chevron-left" className="mr-1" />
                Back
              </Link>
            </div>
          )}
          <h3 className="">List Employees/Dependents</h3>

          {!!employeesData && employeesData.length ? (
            <Fragment>
              <br />
              <span className="employee-get-list-filter-data-count-wrapper">
                Total {employeeTypeAfterResults}:{' '}
                <span className="employee-get-list-filter-data-count">
                  {employeesData.length}
                </span>
              </span>
            </Fragment>
          ) : null}
        </div>
        <div className="hpr-flex-table-filter-sort-wrapper align-items-center employee-pending-filter-wrapper employee-get-list-filter-wrapper">
          <TextField
            id="corporateIdVal"
            label="Corporate"
            select
            type="text"
            value={corporateIdVal}
            onChange={handleChangeCorporate}
            size="small"
            className="egl-corporate-select-wrapper"
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
            className="egl-emp-type-select-wrapper"
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
            className="egl-status-select-wrapper"
            variant="outlined"
          >
            {_employeeStatus.map((obj) => {
              return (
                obj.toLowerCase() !== 'pending tpa approval' &&
                obj.toLowerCase() !== 'insurer approved' &&
                obj.toLowerCase() !== 'tpa approved' && (
                  <MenuItem key={obj} value={obj}>
                    {CapitalizeFirstLetter(obj)}
                  </MenuItem>
                )
              );

              // <MenuItem key={obj} value={obj}>
              //   {CapitalizeFirstLetter(obj)}
              // </MenuItem>
            })}
          </TextField>

          <Button
            disabled={!currentStatus || !corporateIdVal || !employeeType}
            className="hpr-filter-sort-submit filter-go-btn"
            onClick={(e) => getAllEmployeesByCorID(e, corporateObj.uuid)}
          >
            GO
          </Button>

          <Fragment>
            <TextField
              id="currentStatus"
              label="Employee Id"
              type="text"
              value={employeeIdTxt}
              onChange={handleChangeEmpId}
              onKeyDown={searchEmployeeKeyDown}
              size="small"
              className="egl-emp-textbox-wrapper ml-4"
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
          </Fragment>

          {!!employeesData && employeesData.length > 0 && (
            <CSVLink
              data={employeesData}
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
          {!!employeesData && (
            <GetAllEmployees
              flexTableArray={employeesData}
              data={viewDetailsData}
            />
          )}
        </div>
      </div>
    </Fragment>
  );

  return executiveListEmployeeTemplate;
});

export default ExecutiveListEmployee;
