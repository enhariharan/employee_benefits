import React, { Fragment, useContext, useState, useEffect } from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './customerInsuranceEnquiry.scss';
import {
  BrowserRouter as Router,
  Route,
  Redirect,
  Switch,
  Link,
  useHistory,
} from 'react-router-dom';

import DateFnsUtils from '@date-io/date-fns';
import {
  MuiPickersUtilsProvider,
  DatePicker,
  DateTimePicker,
} from '@material-ui/pickers';

import { PubSub } from '../../../../services/PubSub';
import { EMP_CONST } from '../../../../services/Constants';
import ApiService from '../../../../services/ApiService';
import { AuthContext } from '../../../../context/AuthContext';

import { Button } from '@material-ui/core';
import TextField from '@material-ui/core/TextField';
import { Formik, Field, Form } from 'formik';
import * as Yup from 'yup';
import MenuItem from '@material-ui/core/MenuItem';

import { CapitalizeFirstLetter } from '../../../../reUseComponents/utils/utils';

const CustomerInsuranceEnquiry = React.memo((props) => {
  // console.log('CustomerInsuranceEnquiry props ', props);
  const history = useHistory();
  const [currentUser] = useContext(AuthContext);
  const [isMobile, setIsMobile] = useState(null);
  useEffect(() => {
    PubSub.subscribe(PubSub.events.IS_MOBILE, (flag) => {
      setIsMobile(flag);
    });
    return () => {
      PubSub.unsubscribe(PubSub.events.IS_MOBILE);
    };
  }, []);

  const [callBackTime, setCallBackTime] = useState(new Date());
  const handleCallBackTimeChange = (e) => {
    setCallBackTime(e);
  };

  const customerInsuranceEnquiryTemplate = (
    <Fragment>
      <div className="hpr_pageHeadingWrapper">
        <div className="hpr_page-heading-left-wrapper">
          {!!isMobile && (
            <div className="hpr-breadcrumb-wrapper">
              <Link to={'/customer-home/services'}>
                <FontAwesomeIcon icon="chevron-left" className="mr-1" />
                Back
              </Link>
            </div>
          )}
          <h3 className="">Insurance Enquiry</h3>
        </div>
      </div>

      <div className="row">
        <div className="col-12">
          <Fragment>
            <div className="hpr_addEmployeeWrapper">
              <Formik
                initialValues={{
                  insuranceType: '',
                  callBackRequestedTime: callBackTime,
                }}
                validationSchema={Yup.object().shape({
                  insuranceType: Yup.string().required('Required'),
                  callBackRequestedTime: Yup.string().required('Required'),
                })}
                onSubmit={(values, { setSubmitting, resetForm }) => {
                  // console.log('values ', values);

                  const postData = {
                    ...values,
                    callBackRequestedTime: callBackTime,
                  };

                  ApiService.post(
                    `${EMP_CONST.URL.cust_customers}/insurance_enquiry`,
                    postData
                  )
                    .then((response) => {
                      // console.log('response Resend ', response);

                      if (
                        typeof response !== 'undefined' &&
                        response.errCode.toLowerCase() === 'success'
                      ) {
                        let respNotiObj = {
                          message: response.data,
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

                  setTimeout(() => {
                    setSubmitting(false);
                    resetForm(values);
                    setCallBackTime(new Date());
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
                    {/* <pre>{JSON.stringify(values, null, 1)}</pre> */}
                    {/* <pre>{JSON.stringify(callBackTime)}</pre> */}
                    <Form className="row">
                      <div className="col-lg-6">
                        <div className="row">
                          <div className="col-12 hpr_aEColWrapper">
                            <div className="hpr_aETxtFieldsWrapper">
                              <TextField
                                id="insuranceType"
                                label="Insurance Type"
                                select
                                type="text"
                                value={values.insuranceType}
                                onChange={handleChange('insuranceType')}
                                error={
                                  errors.insuranceType && touched.insuranceType
                                }
                                helperText={
                                  errors.insuranceType && touched.insuranceType
                                    ? errors.insuranceType
                                    : null
                                }
                              >
                                {EMP_CONST.INSURANCE_TYPE.map((value) => (
                                  <MenuItem key={value} value={value}>
                                    {CapitalizeFirstLetter(value)}
                                  </MenuItem>
                                ))}
                              </TextField>
                            </div>
                          </div>

                          <div className="col-12 hpr_aEColWrapper">
                            <div className="hpr_aETxtFieldsWrapper">
                              {/* <TextField
                                id="convenientCallBackTime"
                                label=" Convenient Call Back Time"
                                type="text"
                                value={values.convenientCallBackTime}
                                onChange={handleChange}
                                error={
                                  errors.convenientCallBackTime &&
                                  touched.convenientCallBackTime
                                }
                                helperText={
                                  errors.convenientCallBackTime &&
                                  touched.convenientCallBackTime
                                    ? errors.convenientCallBackTime
                                    : null
                                }
                              /> */}
                              <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                <DateTimePicker
                                  id="callBackTime"
                                  autoOk
                                  disablePast
                                  label="Convenient Call Back Time"
                                  value={callBackTime}
                                  onChange={handleCallBackTimeChange}
                                  // type="datetime-local"
                                  // format="dd/MM/yyyy"
                                  animateYearScrolling
                                  InputProps={{
                                    endAdornment: (
                                      <FontAwesomeIcon icon="calendar-alt" />
                                    ),
                                  }}
                                  error={errors.dob && touched.dob}
                                  helperText={
                                    errors.dob && touched.dob
                                      ? errors.dob
                                      : null
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
                        </div>
                      </div>
                    </Form>
                  </div>
                )}
              />
            </div>
          </Fragment>
        </div>
      </div>
    </Fragment>
  );

  return customerInsuranceEnquiryTemplate;
});

export default CustomerInsuranceEnquiry;
