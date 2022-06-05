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

import { useTheme } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';

import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

import { Button } from '@material-ui/core';

import TextField from '@material-ui/core/TextField';

import { Formik, Field, Form } from 'formik';
import * as Yup from 'yup';

import Slide from '@material-ui/core/Slide';
import MenuItem from '@material-ui/core/MenuItem';

import { PubSub } from '../../../../services/PubSub';
import ApiService from '../../../../services/ApiService';
import { EMP_CONST } from '../../../../services/Constants';

import GetIssuesList from '../../../commonPages/getIssuesList/GetIssuesList';

import { AuthContext } from '../../../../context/AuthContext';

import { CapitalizeFirstLetter } from '../../../../reUseComponents/utils/utils';

// For Slide Modal Window
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="down" ref={ref} {...props} />;
});

const CustomerIssuesList = React.memo((props) => {
  // console.log('CustomerIssuesList props ', props);
  const [isMobile, setIsMobile] = useState(null);
  const [listOfReportedIssues, setListOfReportedIssues] = useState([]);
  const [currentUser] = useContext(AuthContext);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    getReportedIssues();
    PubSub.subscribe(PubSub.events.IS_MOBILE, (flag) => {
      setIsMobile(flag);
    });
    return () => {
      PubSub.unsubscribe(PubSub.events.IS_MOBILE);
    };
  }, []);

  const getReportedIssues = () => {
    if (currentUser === null) {
      return;
    }

    let dynamicURL;

    dynamicURL = `${EMP_CONST.URL.cust_customers}/getReportedIssues`;
    // dynamicURL = `${EMP_CONST.URL.exe_createCustomers}?corporateUuid=${currentUser.corporateUuid}&status=${currentStatus}`;

    ApiService.get(dynamicURL)
      .then((response) => {
        if (typeof response !== 'undefined' && !!response.data) {
          setListOfReportedIssues(response.data);
        }
      })
      .catch((err) => {
        // console.log(`Resend Error ${JSON.stringify(err)} `);
        if (!!err.data && (!!err.data.errCode || !!err.data.message)) {
          let respNotiObj = {
            message: err.data.message || err.data.errCode,
            color: 'error',
          };
          PubSub.publish(PubSub.events.SNACKBAR_PROVIDER, respNotiObj);
        }
      })
      .finally(() => {
        // console.log(`Finally `);
      });
  };

  const viewDetailsData = {
    pageHeading: 'Issues List',
  };
  const [isIssueModalOpen, setIsIssueModalOpen] = useState(false);
  const createIssueModal = () => {
    if (!isIssueModalOpen) {
      setIsIssueModalOpen(true);
    }
  };
  const closeIssueModal = (e) => {
    setIsIssueModalOpen(false);
  };

  const customerIssuesListTemplate = (
    <Fragment>
      {/* <pre>{JSON.stringify(listOfReportedIssues, null, 1)}</pre> */}
      <div className="hpr_pageHeadingWrapper">
        <div className="hpr_page-heading-left-wrapper">
          <div className="hpr-breadcrumb-wrapper">
            <Link to={'/customer-home/services'}>
              <FontAwesomeIcon icon="chevron-left" className="mr-1" />
              Back
            </Link>
          </div>
          <h3 className="">Issues List</h3>
        </div>

        <div className="hpr-flex-table-filter-sort-wrapper align-items-center hpr-exe-services-wrapper">
          <Button
            className="hpr-download-template-wrapper"
            onClick={createIssueModal}
          >
            <FontAwesomeIcon icon="plus" className="mr-2" /> Create Issue
          </Button>
        </div>
      </div>

      <div className="row">
        <div className="col-12">
          {!!listOfReportedIssues && (
            <GetIssuesList
              flexTableArray={listOfReportedIssues}
              data={viewDetailsData}
            />
          )}
        </div>
      </div>

      {!!isIssueModalOpen && (
        <Dialog
          disableBackdropClick
          disableEscapeKeyDown
          fullScreen={fullScreen}
          className="hpr-reply-issue-dialog"
          open={isIssueModalOpen}
          TransitionComponent={Transition}
          onClose={closeIssueModal}
          aria-labelledby="responsive-dialog-title"
        >
          <Formik
            // enableReinitialize
            initialValues={{
              issueType: '',
              description: '',
            }}
            validationSchema={Yup.object().shape({
              issueType: Yup.string().required('Required'),
              description: Yup.string().required('Required'),
            })}
            onSubmit={(values, { setSubmitting, resetForm }) => {
              let postData = {
                ...values,
              };

              ApiService.post(
                `${EMP_CONST.URL.cust_customers}/report_issue`,
                postData
              )
                .then((response) => {
                  if (!!response && response.errCode === 'Success') {
                    let respNotiObj = {
                      message: response.data,
                      color: 'success',
                    };
                    PubSub.publish(
                      PubSub.events.SNACKBAR_PROVIDER,
                      respNotiObj
                    );

                    getReportedIssues();
                  }
                })
                .catch((err) => {
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
                  closeIssueModal();
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
              <Form onSubmit={handleSubmit} className="shoppingListFormWrapper">
                <DialogTitle
                  id="responsive-dialog-title"
                  className="dialogTitle"
                >
                  Report Issue
                </DialogTitle>

                <DialogContent>
                  <DialogContentText>
                    <div className="row mb-3">
                      <div className="col-12">
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

                    <div className="row mb-3">
                      <div className="col-12">
                        <TextField
                          id="description"
                          label="Description"
                          type="text"
                          multiline
                          rows={3}
                          value={values.description}
                          onChange={handleChange}
                          error={errors.description && touched.description}
                          helperText={
                            errors.description && touched.description
                              ? errors.description
                              : null
                          }
                        />
                      </div>
                    </div>
                  </DialogContentText>
                </DialogContent>
                {/* ______ Action Buttons */}
                <DialogActions className="mt-3">
                  {/* Secondary Button Area */}
                  <Button
                    variant="outlined"
                    className=""
                    onClick={closeIssueModal}
                  >
                    No
                  </Button>
                  {/* Primary Button Area */}
                  <Button
                    variant="outlined"
                    className="modal-primary-btn"
                    onClick={submitForm}
                  >
                    Submit
                  </Button>
                </DialogActions>
              </Form>
            )}
          />
        </Dialog>
      )}
    </Fragment>
  );

  return customerIssuesListTemplate;
});

export default CustomerIssuesList;
