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

import { AuthContext } from '../../../context/AuthContext';
import { EMP_CONST } from '../../../services/Constants';
import { PubSub } from '../../../services/PubSub';
import ApiService from '../../../services/ApiService';

import { Button } from '@material-ui/core';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { Formik, Field, Form } from 'formik';
import * as Yup from 'yup';
import MenuItem from '@material-ui/core/MenuItem';

import MomentReg from 'moment';

import {
  CapitalizeFirstLetter,
  stateArray,
} from '../../../reUseComponents/utils/utils';

import {
  BrowserRouter as Router,
  Route,
  Redirect,
  Switch,
  Link,
  useHistory,
} from 'react-router-dom';

const AddDependent = React.memo((props) => {
  // console.log('AddDependent props ', props);
  const history = useHistory();

  const [currentUser] = useContext(AuthContext);

  let isEditDependant;
  !!props.propObj.methodType &&
  !!props.propObj.currentObj &&
  Object.keys(props.propObj.currentObj).length > 0
    ? (isEditDependant = true)
    : (isEditDependant = false);

  let isEmpId;
  !!props.propObj.currentObj &&
  Object.keys(props.propObj.currentObj).length > 0 &&
  !!props.propObj.currentObj.empId
    ? (isEmpId = true)
    : (isEmpId = false);

  const [selectedDob, setSelectedDob] = useState(
    !!isEditDependant ? props.propObj.currentObj.dob : new Date()
  );

  const handleDobChange = (e) => {
    if (!e) {
      return;
    }
    setSelectedDob(e);
  };

  const addDependentTemplate = (
    <Fragment>
      <div className="hpr_addEmployeeWrapper">
        <Formik
          initialValues={{
            empid: !!isEmpId ? props.propObj.currentObj.empId : '',
            relationship: !!isEditDependant
              ? CapitalizeFirstLetter(props.propObj.currentObj.relationship)
              : '',
            firstName: !!isEditDependant
              ? props.propObj.currentObj.firstName
              : '',
            lastName: !!isEditDependant
              ? props.propObj.currentObj.lastName
              : '',
            gender: !!isEditDependant ? props.propObj.currentObj.gender : '',
            // addressBuildingName: !!isEditDependant
            //   ? props.propObj.currentObj.addressBuildingName
            //   : '',
            // addressBuildingAddress: !!isEditDependant
            //   ? props.propObj.currentObj.addressBuildingAddress
            //   : '',
            // addressStreet: !!isEditDependant
            //   ? props.propObj.currentObj.addressStreet
            //   : '',
            // addressState: !!isEditDependant
            //   ? props.propObj.currentObj.addressState
            //   : '',
            // addressCity: !!isEditDependant
            //   ? props.propObj.currentObj.addressCity
            //   : '',
            // addressDistrict: !!isEditDependant
            //   ? props.propObj.currentObj.addressDistrict
            //   : '',
            // addressPincode: !!isEditDependant
            //   ? props.propObj.currentObj.addressPincode
            //   : '',
            // contactFirstName: !!isEditDependant
            //   ? props.propObj.currentObj.contactFirstName
            //   : '',
            // contactLastName: !!isEditDependant
            //   ? props.propObj.currentObj.contactLastName
            //   : '',
            // contactMobile: !!isEditDependant
            //   ? props.propObj.currentObj.contactMobile
            //   : '',
            // contactEmail: !!isEditDependant
            //   ? props.propObj.currentObj.contactEmail
            //   : '',
            dob: selectedDob,
          }}
          validationSchema={Yup.object().shape({
            empid: !!isEditDependant
              ? Yup.string()
              : Yup.string().required('Required'),
            relationship: Yup.string().required('Required'),
            firstName: Yup.string().required('Required'),
            lastName: Yup.string().required('Required'),
            gender: Yup.string().required('Required'),
            // addressBuildingName: Yup.string().required('Required'),
            // addressBuildingAddress: Yup.string().required('Required'),
            // addressStreet: Yup.string().required('Required'),
            // addressState: Yup.string().required('Required'),
            // addressDistrict: Yup.string().required('Required'),
            // addressCity: Yup.string().required('Required'),
            // addressPincode: Yup.string()
            //   .matches(/^[0-9]{6}$/, 'Must be exactly 6 digits')
            //   .required('Required'),
            // contactMobile: Yup.string()
            //   .matches(/^[0-9]{10}$/, 'Must be exactly 10 digits')
            //   .required('Required'),
            // contactEmail: Yup.string().email().required('Required'),
            // contactFirstName: Yup.string().required('Required'),
            // contactLastName: Yup.string().required('Required'),
            dob: Yup.string().required('Required'),
          })}
          onSubmit={(values, { setSubmitting, resetForm }) => {
            const postData = {
              ...values,
              dob: MomentReg(
                MomentReg.utc(selectedDob).toDate().toUTCString()
              ).format('DD/MM/YYYY'),
              corporateUuid: currentUser.corporateUuid,
            };

            if (!!isEditDependant) {
              postData.uuid = props.propObj.currentObj.uuid;
              delete postData.empid;
            }

            let methodType = props.propObj.methodType;

            const addEditDepCB = (cbAPI) => {
              cbAPI
                .then((response) => {
                  // console.log('response Resend ', response);
                  if (
                    typeof response !== 'undefined' &&
                    response.errCode.toLowerCase() === 'success'
                  ) {
                    !isEditDependant
                      ? history.push(props.propObj.redirectURL)
                      : history.goBack();

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

            !!methodType && methodType === 'put'
              ? addEditDepCB(
                  // ApiService.put(
                  //   `${EMP_CONST.URL.exe_createCustomers}/${values.empid}/dependents`,
                  //   postData
                  // )
                  ApiService.put(
                    `${EMP_CONST.URL.exe_createCustomers}/dependents`,
                    postData
                  )
                )
              : addEditDepCB(
                  ApiService.post(
                    `${EMP_CONST.URL.exe_createCustomers}/${values.empid}/dependents`,
                    [postData]
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
              {/* <pre>{JSON.stringify(values)}</pre> */}
              <Form className="row">
                {!isEditDependant && (
                  <div className="col-lg-4 col-md-6 col-12 hpr_aEColWrapper">
                    <div className="hpr_aETxtFieldsWrapper">
                      <TextField
                        id="empid"
                        label="Employee Id"
                        type="text"
                        disabled={!!isEmpId}
                        value={values.empid}
                        onChange={handleChange}
                        error={errors.empid && touched.empid}
                        helperText={
                          errors.empid && touched.empid ? errors.empid : null
                        }
                      />
                    </div>
                  </div>
                )}

                <div className="col-lg-4 col-md-6 col-12 hpr_aEColWrapper">
                  <div className="hpr_aETxtFieldsWrapper">
                    <TextField
                      id="relationship"
                      label="Relationship"
                      select
                      type="text"
                      value={values.relationship}
                      onChange={handleChange('relationship')}
                      onBlur={handleBlur}
                      error={errors.relationship && touched.relationship}
                      helperText={
                        errors.relationship && touched.relationship
                          ? errors.relationship
                          : null
                      }
                    >
                      {EMP_CONST.EMPLOYEE_RELATION.map((obj) => (
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

                {/* <div className="col-lg-4 col-md-6 col-12 hpr_aEColWrapper">
                  <div className="hpr_aETxtFieldsWrapper">
                    <TextField
                      id="addressBuildingName"
                      label="Building Name"
                      type="text"
                      value={values.addressBuildingName}
                      onChange={handleChange}
                      error={
                        errors.addressBuildingName &&
                        touched.addressBuildingName
                      }
                      helperText={
                        errors.addressBuildingName &&
                        touched.addressBuildingName
                          ? errors.addressBuildingName
                          : null
                      }
                    />
                  </div>
                </div>

                <div className="col-lg-4 col-md-6 col-12 hpr_aEColWrapper">
                  <div className="hpr_aETxtFieldsWrapper">
                    <TextField
                      id="addressBuildingAddress"
                      label="Building Address"
                      type="text"
                      value={values.addressBuildingAddress}
                      onChange={handleChange}
                      error={
                        errors.addressBuildingAddress &&
                        touched.addressBuildingAddress
                      }
                      helperText={
                        errors.addressBuildingAddress &&
                        touched.addressBuildingAddress
                          ? errors.addressBuildingAddress
                          : null
                      }
                    />
                  </div>
                </div>
                <div className="col-lg-4 col-md-6 col-12 hpr_aEColWrapper">
                  <div className="hpr_aETxtFieldsWrapper">
                    <TextField
                      id="addressStreet"
                      label="Street"
                      type="text"
                      value={values.addressStreet}
                      onChange={handleChange}
                      error={errors.addressStreet && touched.addressStreet}
                      helperText={
                        errors.addressStreet && touched.addressStreet
                          ? errors.addressStreet
                          : null
                      }
                    />
                  </div>
                </div>

                {!!stateArray && stateArray.length > 0 && (
                  <div className="col-lg-4 col-md-6 col-12 hpr_aEColWrapper">
                    <div className="hpr_aETxtFieldsWrapper">
                      <TextField
                        id="addressState"
                        label="State"
                        select
                        type="text"
                        value={values.addressState}
                        onChange={handleChange('addressState')}
                        onBlur={handleBlur}
                        error={errors.addressState && touched.addressState}
                        helperText={
                          errors.addressState && touched.addressState
                            ? errors.addressState
                            : null
                        }
                      >
                        {stateArray.map((obj) => (
                          <MenuItem key={obj.code} value={obj.code}>
                            {CapitalizeFirstLetter(obj.name)}
                          </MenuItem>
                        ))}
                      </TextField>
                    </div>
                  </div>
                )}

                <div className="col-lg-4 col-md-6 col-12 hpr_aEColWrapper">
                  <div className="hpr_aETxtFieldsWrapper">
                    <TextField
                      id="addressDistrict"
                      label="District"
                      type="text"
                      value={values.addressDistrict}
                      onChange={handleChange}
                      error={errors.addressDistrict && touched.addressDistrict}
                      helperText={
                        errors.addressDistrict && touched.addressDistrict
                          ? errors.addressDistrict
                          : null
                      }
                    />
                  </div>
                </div>

                <div className="col-lg-4 col-md-6 col-12 hpr_aEColWrapper">
                  <div className="hpr_aETxtFieldsWrapper">
                    <TextField
                      id="addressCity"
                      label="City"
                      type="text"
                      value={values.addressCity}
                      onChange={handleChange}
                      error={errors.addressCity && touched.addressCity}
                      helperText={
                        errors.addressCity && touched.addressCity
                          ? errors.addressCity
                          : null
                      }
                    />
                  </div>
                </div>

                <div className="col-lg-4 col-md-6 col-12 hpr_aEColWrapper">
                  <div className="hpr_aETxtFieldsWrapper">
                    <TextField
                      id="addressPincode"
                      label="Pincode"
                      type="text"
                      value={values.addressPincode}
                      onChange={handleChange}
                      error={errors.addressPincode && touched.addressPincode}
                      helperText={
                        errors.addressPincode && touched.addressPincode
                          ? errors.addressPincode
                          : null
                      }
                    />
                  </div>
                </div>

                <div className="col-lg-4 col-md-6 col-12 hpr_aEColWrapper">
                  <div className="hpr_aETxtFieldsWrapper">
                    <TextField
                      id="contactFirstName"
                      label="Contact FirstName"
                      type="text"
                      value={values.contactFirstName}
                      onChange={handleChange}
                      error={
                        errors.contactFirstName && touched.contactFirstName
                      }
                      helperText={
                        errors.contactFirstName && touched.contactFirstName
                          ? errors.contactFirstName
                          : null
                      }
                    />
                  </div>
                </div>

                <div className="col-lg-4 col-md-6 col-12 hpr_aEColWrapper">
                  <div className="hpr_aETxtFieldsWrapper">
                    <TextField
                      id="contactLastName"
                      label="Contact LastName"
                      type="text"
                      value={values.contactLastName}
                      onChange={handleChange}
                      error={errors.contactLastName && touched.contactLastName}
                      helperText={
                        errors.contactLastName && touched.contactLastName
                          ? errors.contactLastName
                          : null
                      }
                    />
                  </div>
                </div>

                <div className="col-lg-4 col-md-6 col-12 hpr_aEColWrapper">
                  <div className="hpr_aETxtFieldsWrapper">
                    <TextField
                      id="contactMobile"
                      label="Contact Mobile"
                      type="text"
                      value={values.contactMobile}
                      onChange={handleChange}
                      error={errors.contactMobile && touched.contactMobile}
                      helperText={
                        errors.contactMobile && touched.contactMobile
                          ? errors.contactMobile
                          : null
                      }
                    />
                  </div>
                </div>

                <div className="col-lg-4 col-md-6 col-12 hpr_aEColWrapper">
                  <div className="hpr_aETxtFieldsWrapper">
                    <TextField
                      id="contactEmail"
                      label="Contact Email"
                      type="text"
                      value={values.contactEmail}
                      onChange={handleChange}
                      error={errors.contactEmail && touched.contactEmail}
                      helperText={
                        errors.contactEmail && touched.contactEmail
                          ? errors.contactEmail
                          : null
                      }
                    />
                  </div>
                </div> */}

                <div className="col-lg-4 col-md-6 col-12 hpr_aEColWrapper">
                  <div className="hpr_aETxtFieldsWrapper">
                    {/* <TextField
                      id="dob"
                      label="DOB"
                      type="text"
                      value={values.dob}
                      onChange={handleChange}
                    /> */}

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

  return addDependentTemplate;
});

export default AddDependent;
