import React, {
  Fragment,
  useContext,
  useState,
  useEffect,
  useRef,
} from 'react';

import { AuthContext } from '../../../context/AuthContext';
import { EMP_CONST } from '../../../services/Constants';
import { PubSub } from '../../../services/PubSub';
import ApiService from '../../../services/ApiService';

import { Button } from '@material-ui/core';
import TextField from '@material-ui/core/TextField';
import { Formik, Field, Form } from 'formik';
import * as Yup from 'yup';
import MenuItem from '@material-ui/core/MenuItem';

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

const AddExecutive = React.memo((props) => {
  // console.log('AddExecutive props ', props);
  const history = useHistory();

  const [currentUser] = useContext(AuthContext);

  const [currentExecutiveObj, setCurrentExecutiveObj] = useState({});

  let isEditExecutive;
  !!props.propObj.methodType &&
  !!props.propObj.currentObj &&
  Object.keys(props.propObj.currentObj).length > 0
    ? (isEditExecutive = true)
    : (isEditExecutive = false);

  if (!!isEditExecutive && Object.keys(currentExecutiveObj).length === 0) {
    setCurrentExecutiveObj(props.propObj.currentObj.corporate);
  }

  const addExecutiveTemplate = (
    <Fragment>
      <div className="hpr_addEmployeeWrapper">
        <Formik
          initialValues={{
            empid: !!isEditExecutive ? currentExecutiveObj.empid : '',
            firstName: !!isEditExecutive ? currentExecutiveObj.firstName : '',
            lastName: !!isEditExecutive ? currentExecutiveObj.lastName : '',
            email: !!isEditExecutive ? currentExecutiveObj.email : '',
            mobile: !!isEditExecutive ? currentExecutiveObj.mobile : '',
            designation: !!isEditExecutive
              ? currentExecutiveObj.designation
              : 'executive',
            supervisorEmpid: currentUser.empid,
          }}
          validationSchema={Yup.object().shape({
            empid: Yup.string().required('Required'),
            firstName: Yup.string()
              .matches(/^[a-zA-Z]+$/, 'Accepts only alphabets')
              .required('Required'),
            lastName: Yup.string()
              .matches(/^[a-zA-Z]+$/, 'Accepts only alphabets')
              .required('Required'),
            email: Yup.string().required('Required'),
            mobile: Yup.string()
              .matches(/^[0-9]{10}$/, 'Must be exactly 10 digits')
              .required('Required'),
            designation: Yup.string().required('Required'),
          })}
          onSubmit={(values, { setSubmitting, resetForm }) => {
            const postData = { ...values };

            // if (!!isEditExecutive) {
            postData.brokingCompanyUuid = currentUser.brokingCompanyUuid;
            // }

            let methodType = props.propObj.methodType;

            const addEditExecutiveCB = (cbAPI) => {
              cbAPI
                .then((response) => {
                  // console.log('response Resend ', response);
                  if (
                    typeof response !== 'undefined' &&
                    response.errCode.toLowerCase() === 'success'
                  ) {
                    !isEditExecutive
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
                  // console.log(`Finally `);
                });
            };

            !!methodType && methodType === 'put'
              ? addEditExecutiveCB(
                  ApiService.put(`${EMP_CONST.URL.exe_getCorporates}`, postData)
                )
              : addEditExecutiveCB(
                  ApiService.post(`${EMP_CONST.URL.exe_getExecutives}`, [
                    postData,
                  ])
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
              {/* <pre>{JSON.stringify(!!isEditDependant)}</pre> */}
              <Form className="row">
                <div className="col-lg-4 col-md-6 col-12 hpr_aEColWrapper">
                  <div className="hpr_aETxtFieldsWrapper">
                    <TextField
                      id="empid"
                      label="Emp Id"
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

                {/* <div className="col-lg-4 col-md-6 col-12 hpr_aEColWrapper">
                  <div className="hpr_aETxtFieldsWrapper">
                    <TextField
                      id="branchCode"
                      label="Branch Code"
                      type="text"
                      value={values.branchCode}
                      onChange={handleChange}
                      error={errors.branchCode && touched.branchCode}
                      helperText={
                        errors.branchCode && touched.branchCode
                          ? errors.branchCode
                          : null
                      }
                    />
                  </div>
                </div> */}

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
                      id="email"
                      label="email"
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
                    <TextField
                      id="designation"
                      label="Designation"
                      type="text"
                      value={values.designation}
                      onChange={handleChange}
                      error={errors.designation && touched.designation}
                      helperText={
                        errors.designation && touched.designation
                          ? errors.designation
                          : null
                      }
                      InputProps={{
                        readOnly: true,
                      }}
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

  return addExecutiveTemplate;
});

export default AddExecutive;
