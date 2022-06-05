import React, {
  Fragment,
  useContext,
  useState,
  useEffect,
  useRef,
} from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import DateFnsUtils from '@date-io/date-fns';
import { MuiPickersUtilsProvider, DatePicker } from '@material-ui/pickers';

import './addEmployee.scss';

import update from 'immutability-helper';

import MomentReg from 'moment';

import { AuthContext } from '../../../context/AuthContext';
import { EMP_CONST } from '../../../services/Constants';
import { PubSub } from '../../../services/PubSub';
import ApiService from '../../../services/ApiService';
import { GlobalDataContext } from '../../../context/GlobalDataContext';

import { Button } from '@material-ui/core';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { Formik, Field, Form } from 'formik';
import * as Yup from 'yup';
import MenuItem from '@material-ui/core/MenuItem';

import {
  CapitalizeFirstLetter,
  stateArray,
  uniqueCorporateObject,
} from '../../../reUseComponents/utils/utils';

import {
  BrowserRouter as Router,
  Route,
  Redirect,
  Switch,
  Link,
  useHistory,
} from 'react-router-dom';

const AddEmployee = React.memo((props) => {
  // console.log('AddEmployee props ', props);
  const history = useHistory();
  const [globalOnLoadData, setGlobalOnLoadData] = useContext(GlobalDataContext);

  let isGlobalCorporateData;
  !!globalOnLoadData &&
  Object.keys(globalOnLoadData).length > 0 &&
  !!globalOnLoadData.corporatesData
    ? (isGlobalCorporateData = true)
    : (isGlobalCorporateData = false);

  const [currentUser] = useContext(AuthContext);
  // console.log('currentUser AddEmployee ', currentUser);

  let isEditEmployee;
  !!props.propObj.currentObj && Object.keys(props.propObj.currentObj).length > 0
    ? (isEditEmployee = true)
    : (isEditEmployee = false);

  const myRef = useRef();

  const [selectedDob, setSelectedDob] = useState(
    !!isEditEmployee ? props.propObj.currentObj.dob : new Date()
  );
  const [selectedDateOfJoining, setSelectedDateOfJoining] = useState(
    !!isEditEmployee ? props.propObj.currentObj.dateOfJoining : new Date()
  );

  const handleDateOfJoining = (e) => {
    if (!e) {
      return;
    }
    setSelectedDateOfJoining(e);
  };

  const [corporatesData, setCorporatesData] = useState(
    (!!isGlobalCorporateData && globalOnLoadData.corporatesData) || []
  );
  const [currentEmpObj] = useState(props.propObj.currentObj || {});

  const handleDobChange = (e) => {
    // console.log('handleDobChange e ', e);
    if (!e) {
      return;
    }
    setSelectedDob(e);
  };

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

  const addEmployeeTemplate = (
    <Fragment>
      <div className="hpr_addEmployeeWrapper">
        <Formik
          initialValues={{
            empid: !!isEditEmployee ? props.propObj.currentObj.empid : '',
            corporateUuid: !!isEditEmployee
              ? props.propObj.currentObj.corporateUuid
              : '',
            firstName: !!isEditEmployee
              ? props.propObj.currentObj.firstName
              : '',
            lastName: !!isEditEmployee ? props.propObj.currentObj.lastName : '',
            gender: !!isEditEmployee ? props.propObj.currentObj.gender : '',
            email: !!isEditEmployee ? props.propObj.currentObj.email : '',
            mobile: !!isEditEmployee ? props.propObj.currentObj.mobile : '',
            sumInsured: !!isEditEmployee
              ? props.propObj.currentObj.sumInsured
              : '',
            dob: selectedDob,
            dateOfJoining: selectedDateOfJoining,
            dateOfExit: !!isEditEmployee
              ? props.propObj.currentObj.dateOfExit
              : null,
          }}
          validationSchema={Yup.object().shape({
            corporateUuid:
              currentUser.role === 'executive'
                ? Yup.string().required('Required')
                : Yup.string(),
            empid: Yup.string().required('Required'),
            firstName: Yup.string().required('Required'),
            lastName: Yup.string().required('Required'),
            gender: Yup.string().required('Required'),
            email: Yup.string().email().required('Required'),
            mobile: Yup.string()
              .matches(/^[0-9]{10}$/, 'Must be exactly 10 digits')
              .required('Required'),
            sumInsured: Yup.string()
              .matches(/^\d+(?:\.\d+)?$/)
              .required('Required'),
            dob: Yup.string().required('Required'),
            dateOfJoining: Yup.string(),
            dateOfExit: '',
          })}
          onSubmit={(values, { setSubmitting, resetForm }) => {
            // console.log('values ', values);
            const postData = {
              ...values,
              dob: MomentReg(
                MomentReg.utc(selectedDob).toDate().toUTCString()
              ).format('DD/MM/YYYY'),
            };

            if (!!isEditEmployee) {
              postData.uuid = currentEmpObj.uuid;
            }

            if (currentUser.role === 'hr') {
              postData.corporateUuid = currentUser.corporateUuid;
            }

            const addEditEmpCB = (cbAPI) => {
              cbAPI
                .then((response) => {
                  // console.log('response Resend ', response);

                  if (
                    typeof response !== 'undefined' &&
                    response.errCode.toLowerCase() === 'success'
                  ) {
                    history.push(props.propObj.redirectURL);

                    let respNotiObj = {
                      message: response.message,
                      color: 'success',
                    };
                    PubSub.publish(
                      PubSub.events.SNACKBAR_PROVIDER,
                      respNotiObj
                    );
                  }
                })
                .catch((err) => {
                  console.log(`Resend Error ${JSON.stringify(err)} `);
                  if (
                    !!err.data &&
                    (!!err.data.errCode || !!err.data.message)
                  ) {
                    let respNotiObj = {
                      message: err.data.message || err.data.errCode,
                      color: 'error',
                    };
                    PubSub.publish(
                      PubSub.events.SNACKBAR_PROVIDER,
                      respNotiObj
                    );
                  }
                })
                .finally(() => {
                  console.log(`Finally `);
                });
            };

            let methodType = props.propObj.methodType;

            !!methodType && methodType === 'post'
              ? addEditEmpCB(
                  ApiService.post(`${EMP_CONST.URL.exe_createCustomers}`, [
                    postData,
                  ])
                )
              : addEditEmpCB(
                  ApiService.put(
                    `${EMP_CONST.URL.exe_createCustomers}`,
                    postData
                  )
                );

            setTimeout(() => {
              setSubmitting(false);
              resetForm(values);
            }, 500);
          }}
          render={({
            handleSubmit,
            handleReset,
            handleChange,
            isSubmitting,
            handleBlur,
            values,
            errors,
            touched,
            dirty,
            submitForm,
          }) => (
            <div className="hpr_aEmployeeFormFieldsWrapper">
              {/* <pre>
                {JSON.stringify(values, null, 4).replace(/["{[,\}\]]/g, '')}
              </pre> */}
              <Form className="row">
                {(currentUser.role === 'executive' ||
                  currentUser.role === 'manager') && (
                  <div className="col-lg-4 col-md-6 col-12 hpr_aEColWrapper">
                    <div className="hpr_aETxtFieldsWrapper">
                      <TextField
                        id="corporateUuid"
                        label="Corporate"
                        select
                        type="text"
                        value={values.corporateUuid}
                        onChange={handleChange('corporateUuid')}
                        onBlur={handleBlur}
                        error={errors.corporateUuid && touched.corporateUuid}
                        helperText={
                          errors.corporateUuid && touched.corporateUuid
                            ? errors.corporateUuid
                            : null
                        }
                      >
                        {corporatesData.map((obj) => (
                          <MenuItem key={obj.uuid} value={obj.uuid}>
                            {CapitalizeFirstLetter(obj.companyName)}
                          </MenuItem>
                        ))}
                      </TextField>
                    </div>
                  </div>
                )}

                <div className="col-lg-4 col-md-6 col-12 hpr_aEColWrapper">
                  <div className="hpr_aETxtFieldsWrapper">
                    <TextField
                      id="empid"
                      label="Employee Id"
                      type="text"
                      value={values.empid}
                      onChange={handleChange}
                      error={errors.empid && touched.empid}
                      helperText={
                        errors.empid && touched.empid ? errors.empid : null
                      }
                    />
                  </div>
                </div>

                <div className="col-lg-4 col-md-6 col-12 hpr_aEColWrapper">
                  <div className="hpr_aETxtFieldsWrapper">
                    <TextField
                      id="firstName"
                      label="First Name"
                      type="text"
                      value={values.firstName}
                      onChange={handleChange}
                      error={errors.firstName && touched.firstName}
                      helperText={
                        errors.firstName && touched.firstName
                          ? errors.firstName
                          : null
                      }
                    />
                  </div>
                </div>

                <div className="col-lg-4 col-md-6 col-12 hpr_aEColWrapper">
                  <div className="hpr_aETxtFieldsWrapper">
                    <TextField
                      id="lastName"
                      label="Last Name"
                      type="text"
                      value={values.lastName}
                      onChange={handleChange}
                      error={errors.lastName && touched.lastName}
                      helperText={
                        errors.lastName && touched.lastName
                          ? errors.lastName
                          : null
                      }
                    />
                  </div>
                </div>

                <div className="col-lg-4 col-md-6 col-12 hpr_aEColWrapper">
                  <div className="hpr_aETxtFieldsWrapper">
                    <TextField
                      id="gender"
                      label="Gender"
                      select
                      type="text"
                      value={values.gender}
                      onChange={handleChange('gender')}
                      onBlur={handleBlur}
                      error={errors.gender && touched.gender}
                      helperText={
                        errors.gender && touched.gender ? errors.gender : null
                      }
                    >
                      {EMP_CONST.GENDER_TYPE.map((obj) => (
                        <MenuItem key={obj.value} value={obj.value}>
                          {CapitalizeFirstLetter(obj.label)}
                        </MenuItem>
                      ))}
                    </TextField>
                  </div>
                </div>

                <div className="col-lg-4 col-md-6 col-12 hpr_aEColWrapper">
                  <div className="hpr_aETxtFieldsWrapper">
                    <TextField
                      id="email"
                      label="Email"
                      type="text"
                      value={values.email}
                      onChange={handleChange}
                      error={errors.email && touched.email}
                      helperText={
                        errors.email && touched.email ? errors.email : null
                      }
                    />
                  </div>
                </div>

                <div className="col-lg-4 col-md-6 col-12 hpr_aEColWrapper">
                  <div className="hpr_aETxtFieldsWrapper">
                    <TextField
                      id="mobile"
                      label="Mobile"
                      type="text"
                      value={values.mobile}
                      onChange={handleChange}
                      error={errors.mobile && touched.mobile}
                      helperText={
                        errors.mobile && touched.mobile ? errors.mobile : null
                      }
                    />
                  </div>
                </div>

                <div className="col-lg-4 col-md-6 col-12 hpr_aEColWrapper">
                  <div className="hpr_aETxtFieldsWrapper">
                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                      <DatePicker
                        id="dob"
                        autoOk
                        label="Date of Birth"
                        disableFuture
                        value={selectedDob}
                        onChange={handleDobChange}
                        format="dd/MM/yyyy"
                        animateYearScrolling
                        InputProps={{
                          endAdornment: <FontAwesomeIcon icon="calendar-alt" />,
                        }}
                        error={errors.dob && touched.dob}
                        helperText={
                          errors.dob && touched.dob ? errors.dob : null
                        }
                      />
                    </MuiPickersUtilsProvider>
                  </div>
                </div>

                <div className="col-lg-4 col-md-6 col-12 hpr_aEColWrapper">
                  <div className="hpr_aETxtFieldsWrapper">
                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                      <DatePicker
                        id="dateOfJoining "
                        autoOk
                        label="Date of Joing"
                        disableFuture
                        value={selectedDateOfJoining}
                        onChange={handleDateOfJoining}
                        format="dd/MM/yyyy"
                        animateYearScrolling
                        InputProps={{
                          endAdornment: <FontAwesomeIcon icon="calendar-alt" />,
                        }}
                        error={errors.dateOfJoining && touched.dateOfJoining}
                        helperText={
                          errors.dateOfJoining && touched.dateOfJoining
                            ? errors.dateOfJoining
                            : null
                        }
                      />
                    </MuiPickersUtilsProvider>
                  </div>
                </div>

                <div className="col-lg-4 col-md-6 col-12 hpr_aEColWrapper">
                  <div className="hpr_aETxtFieldsWrapper">
                    <TextField
                      id="sumInsured"
                      label="Sum Insured"
                      type="number"
                      value={values.sumInsured}
                      onChange={handleChange}
                      error={errors.sumInsured && touched.sumInsured}
                      helperText={
                        errors.sumInsured && touched.sumInsured
                          ? errors.sumInsured
                          : null
                      }
                    />
                  </div>
                </div>

                <div className="mb-3 mt-3 col-12 d-flex justify-content-end">
                  <div className="hpr_formSecondaryBtnWrapper mr-2">
                    <Button variant="contained">Clear</Button>
                  </div>
                  <div className="hpr_formPrimaryBtnWrapper">
                    <Button
                      variant="contained"
                      disabled={isSubmitting}
                      onClick={submitForm}
                    >
                      Submit
                    </Button>
                  </div>
                </div>
              </Form>
            </div>
          )}
        />
      </div>
    </Fragment>
  );

  return addEmployeeTemplate;
});

export default AddEmployee;
