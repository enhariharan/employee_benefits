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

const CustomerReportIssue = React.memo((props) => {
  // console.log('CustomerReportIssue props ', props);
  const history = useHistory();
  const [currentUser] = useContext(AuthContext);

  const customerReportIssueTemplate = (
    <Fragment>
      <div className="hpr_pageHeadingWrapper">
        <div className="hpr_page-heading-left-wrapper">
          <div className="hpr-breadcrumb-wrapper">
            <Link to={'/customer-home/services'}>
              <FontAwesomeIcon icon="chevron-left" className="mr-1" />
              Back
            </Link>
          </div>
          <h3 className="">Report Issue</h3>
        </div>
      </div>

      <div className="row">
        <div className="col-12">
          <Fragment>
            <div className="hpr_addEmployeeWrapper">
              <Formik
                initialValues={{
                  issueType: '',
                  description: '',
                }}
                validationSchema={Yup.object().shape({
                  issueType: Yup.string().required('Required'),
                  description: Yup.string().required('Required'),
                })}
                onSubmit={(values, { setSubmitting, resetForm }) => {
                  // console.log('values ', values);
                  const postData = {
                    ...values,
                  };

                  ApiService.post(
                    `${EMP_CONST.URL.cust_customers}/report_issue`,
                    postData
                  )
                    .then((response) => {
                      // console.log('response Resend ', response);

                      if (
                        typeof response !== 'undefined' &&
                        response.errCode.toLowerCase() === 'success'
                      ) {
                        history.push('./issues-list');
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
                    {/* <pre>{JSON.stringify(values, null, 4)}</pre> */}
                    <Form className="row">
                      <div className="col-lg-6">
                        <div className="row">
                          <div className="col-12 hpr_aEColWrapper">
                            <div className="hpr_aETxtFieldsWrapper">
                              <TextField
                                id="issueType"
                                label="Issue Type"
                                select
                                type="text"
                                value={values.issueType}
                                onChange={handleChange('issueType')}
                                error={errors.issueType && touched.issueType}
                                helperText={
                                  errors.issueType && touched.issueType
                                    ? errors.issueType
                                    : null
                                }
                              >
                                {EMP_CONST.EMPLOYEE_ISSUE_TYPES.map((value) => (
                                  <MenuItem key={value} value={value}>
                                    {CapitalizeFirstLetter(value)}
                                  </MenuItem>
                                ))}
                              </TextField>
                            </div>
                          </div>

                          <div className="col-12 hpr_aEColWrapper">
                            <div className="hpr_aETxtFieldsWrapper">
                              <TextField
                                id="description"
                                label="Description"
                                type="text"
                                multiline
                                rows={3}
                                value={values.description}
                                onChange={handleChange}
                                error={
                                  errors.description && touched.description
                                }
                                helperText={
                                  errors.description && touched.description
                                    ? errors.description
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

  return customerReportIssueTemplate;
});

export default CustomerReportIssue;
