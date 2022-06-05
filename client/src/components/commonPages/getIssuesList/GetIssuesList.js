import React, { Fragment, useContext, useState, useEffect } from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import MenuItem from '@material-ui/core/MenuItem';

import { Link } from 'react-router-dom';

import Moment from 'react-moment';
import MomentReg from 'moment';

import DateFnsUtils from '@date-io/date-fns';
import { MuiPickersUtilsProvider, DatePicker } from '@material-ui/pickers';

import PopperMenu from '../../../reUseComponents/popperMenu/PopperMenu.jsx';
import NoRecords from '../../../reUseComponents/noRecords/NoRecords';

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

import { PubSub } from '../../../services/PubSub';
import ApiService from '../../../services/ApiService';
import { EMP_CONST } from '../../../services/Constants';

import Slide from '@material-ui/core/Slide';

import './getIssuesList.scss';
import '../../../reUseComponents/modalWindow/modalWindow.scss';

// For Slide Modal Window
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="down" ref={ref} {...props} />;
});

const GetIssuesList = React.memo((props) => {
  // console.log('GetIssuesList props ', props);

  useEffect(() => {
    setGetAllIssuesData(props.flexTableArray);
  }, [props.flexTableArray]);

  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));

  const [getAllIssuesData, setGetAllIssuesData] = useState([]);
  const [currentIssueObj, setCurrentIssueObj] = useState({});
  const [changeStatusIssue, setChangeStatusIssue] = useState({});
  const [isClickTableAction, setIsClickTableAction] = React.useState({});
  const [anchorElItemPop, setAnchorElItemPop] = React.useState({});

  const [resolvedDate, setResolvedDate] = useState(new Date());

  const handleResolvedDateChange = (e) => {
    if (!!e) {
      setResolvedDate(e);
    }
  };

  const handleClickTableAction = (event, index) => {
    setIsClickTableAction({ [`row_${index}`]: true });
    setAnchorElItemPop({ [`row_${index}`]: event.currentTarget });
  };

  const handleTableActionClose = (e, index) => {
    setIsClickTableAction({ [`row_${index}`]: false });
  };

  const changeStatusModal = (e, obj, i) => {
    e.preventDefault();
    setChangeStatusIssue({}); // closing open poppers
    setChangeStatusIssue({ [`row_${i}`]: true });
    setIsClickTableAction({});
    setCurrentIssueObj(obj);
  };

  const closeChangeStatusModal = (e) => {
    setChangeStatusIssue({});
  };

  const changeStatusModalSubmit = (e) => {
    setChangeStatusIssue({});
  };

  const tableActionTemplate = (obj, i) => {
    let complaintId = obj.complaintId;
    let headings = { ...props.data, id: obj.complaintId };

    return (
      <Fragment>
        <MenuItem>
          <Link
            to={{
              pathname: `${props.data.detailsPath}/${complaintId}`,
              state: { headings: headings, tableData: obj },
            }}
          >
            <FontAwesomeIcon icon="eye" className="mr-2" /> View details
          </Link>
        </MenuItem>

        {obj.status === 'Pending' && (
          <MenuItem>
            <a onClick={(e) => changeStatusModal(e, obj, i)}>
              <FontAwesomeIcon icon="pencil-alt" className="mr-2" /> Issue Reply
            </a>
          </MenuItem>
        )}
      </Fragment>
    );
  };

  const currentStatusCheck = (status) => {
    let statusChangeToLowerCase = `${status}`.toLowerCase();
    switch (statusChangeToLowerCase) {
      case 'pending':
        return <span className="table-status __pending">Pending</span>;
      case 'resolved':
        return <span className="table-status __active">Resolved</span>;
      default:
        break;
    }
  };

  const getIssuesListTemplate = (
    <Fragment>
      <div class="hpr-flex-table hpr-flex-table--collapse hpr-get-all-issues-wrapper">
        <div class="hpr-flex-table-row hpr-flex-table-row--head">
          <div
            style={{ width: '15%' }}
            class="hpr-flex-table-cell hpr-flex-table-column-heading"
          >
            Issue Type
          </div>

          {!!props.data.isExecutive && (
            <Fragment>
              <div
                style={{ width: '10%' }}
                class="hpr-flex-table-cell hpr-flex-table-column-heading"
              >
                Emp ID
              </div>

              <div
                style={{ width: '10%' }}
                class="hpr-flex-table-cell hpr-flex-table-column-heading"
              >
                Mobile
              </div>

              <div
                style={{ width: '17%' }}
                class="hpr-flex-table-cell hpr-flex-table-column-heading"
              >
                Email
              </div>
            </Fragment>
          )}

          <div
            style={{ width: !!props.data.isExecutive ? '15%' : '30%' }}
            class="hpr-flex-table-cell hpr-flex-table-column-heading"
          >
            Date Of Report
          </div>

          <div
            style={{ width: !!props.data.isExecutive ? '18%' : '40%' }}
            class="hpr-flex-table-cell hpr-flex-table-column-heading"
          >
            Description
          </div>

          <div
            style={{ width: '15%' }}
            class="hpr-flex-table-cell hpr-flex-table-column-heading"
          >
            Status
          </div>
          {!!props.data.isExecutive && (
            <div
              style={{ width: '10%' }}
              class="hpr-flex-table-cell hpr-flex-table-column-heading"
            >
              Actions
            </div>
          )}
        </div>

        {getAllIssuesData.length == 0 && <NoRecords></NoRecords>}

        {getAllIssuesData.length > 0 &&
          getAllIssuesData.map((val, index) => (
            <div class="hpr-flex-table-row">
              <div
                style={{ width: '15%' }}
                class="hpr-flex-table-cell hpr-flex-table-topic-cell"
              >
                <div class="hpr-flex-table-cell--content date-content">
                  <span class="webinar-date">{val.issueType}</span>
                </div>
              </div>

              {!!props.data.isExecutive && (
                <Fragment>
                  <div style={{ width: '10%' }} class="hpr-flex-table-cell">
                    <div class="hpr-flex-table-cell--heading">Emp ID</div>
                    <div class="hpr-flex-table-cell--content title-content">
                      {val.empid}
                    </div>
                  </div>

                  <div style={{ width: '10%' }} class="hpr-flex-table-cell">
                    <div class="hpr-flex-table-cell--heading">Mobile</div>
                    <div class="hpr-flex-table-cell--content title-content">
                      {!!val.mobile ? val.mobile : '-'}
                    </div>
                  </div>

                  <div style={{ width: '17%' }} class="hpr-flex-table-cell">
                    <div class="hpr-flex-table-cell--heading">Email</div>
                    <div class="hpr-flex-table-cell--content title-content">
                      {val.email}
                    </div>
                  </div>
                </Fragment>
              )}

              <div
                style={{ width: !!props.data.isExecutive ? '15%' : '30%' }}
                class="hpr-flex-table-cell"
              >
                <div class="hpr-flex-table-cell--heading">Date Of Report</div>
                <div class="hpr-flex-table-cell--content title-content">
                  {!!props.data.isExecutive ? (
                    <Moment format="DD/MM/YYYY">{`${val.reportedAt}`}</Moment>
                  ) : (
                    <Moment format="DD/MM/YYYY">{`${val.dateOfReport}`}</Moment>
                  )}
                </div>
              </div>

              <div
                style={{ width: !!props.data.isExecutive ? '18%' : '40%' }}
                class="hpr-flex-table-cell"
              >
                <div class="hpr-flex-table-cell--heading">Description</div>
                <div class="hpr-flex-table-cell--content title-content">
                  {val.issueDescription}
                </div>
              </div>

              <div style={{ width: '15%' }} class="hpr-flex-table-cell">
                <div class="hpr-flex-table-cell--heading">Status</div>
                <div class="hpr-flex-table-cell--content hpr-table-status-wrapper access-link-content">
                  {/* {val.status} */}
                  {currentStatusCheck(val.status)}
                </div>
              </div>

              {!!props.data.isExecutive && (
                <div style={{ width: '10%' }} class="hpr-flex-table-cell">
                  <div className="hpr-flex-table-cell--heading">Actions</div>
                  <div className="hpr-flex-table-cell--content replay-link-content">
                    <FontAwesomeIcon
                      icon="ellipsis-v"
                      className="table-action-ellipsis-cursor"
                      onClick={(eve) => handleClickTableAction(eve, index)}
                    />
                  </div>

                  {!!isClickTableAction[`row_${index}`] && (
                    <PopperMenu
                      currentIndex={index}
                      isOpenPop={isClickTableAction[`row_${index}`]}
                      anchorRef={anchorElItemPop[`row_${index}`]}
                      poppoverClick={handleTableActionClose}
                      menuListTemp={tableActionTemplate(val, index)}
                      placement="right-start"
                      minWidth="auto"
                    />
                  )}

                  {!!changeStatusIssue[`row_${index}`] && (
                    <Dialog
                      disableBackdropClick
                      disableEscapeKeyDown
                      fullScreen={fullScreen}
                      className="hpr-reply-issue-dialog"
                      open={changeStatusIssue[`row_${index}`]}
                      TransitionComponent={Transition}
                      onClose={closeChangeStatusModal}
                      aria-labelledby="responsive-dialog-title"
                    >
                      <Formik
                        // enableReinitialize
                        initialValues={{
                          status: '',
                          resolution: '',
                          resolvedDate: '',
                        }}
                        validationSchema={Yup.object().shape({
                          status: Yup.string().required('Required'),
                          resolution: Yup.string().required('Required'),
                        })}
                        onSubmit={(values, { setSubmitting, resetForm }) => {
                          let postData = {
                            ...values,
                            resolvedDate: resolvedDate,
                            complaintId: currentIssueObj.complaintId,
                          };

                          ApiService.put(
                            EMP_CONST.URL.exe_resolveIssue,
                            postData
                          )
                            .then((response) => {
                              // console.log('response Resend ', response);

                              if (
                                !!response &&
                                response.errCode === 'Success' &&
                                !!response.data
                              ) {
                                let respNotiObj = {
                                  message: response.data,
                                  color: 'success',
                                };
                                PubSub.publish(
                                  PubSub.events.SNACKBAR_PROVIDER,
                                  respNotiObj
                                );

                                let indexOfObj = getAllIssuesData.findIndex(
                                  (issue) =>
                                    issue.complaintId ===
                                    currentIssueObj.complaintId
                                );
                                if (indexOfObj > -1) {
                                  let newAllIssuesData = [...getAllIssuesData];
                                  newAllIssuesData[indexOfObj].status =
                                    values.status;
                                  newAllIssuesData[indexOfObj].resolution =
                                    values.resolution;

                                  setGetAllIssuesData(newAllIssuesData);
                                }
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
                              changeStatusModalSubmit();
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
                          <Form
                            onSubmit={handleSubmit}
                            className="shoppingListFormWrapper"
                          >
                            <DialogTitle
                              id="responsive-dialog-title"
                              className="dialogTitle"
                            >
                              Reply to {currentIssueObj.empid}
                            </DialogTitle>

                            <DialogContent>
                              <DialogContentText>
                                <div className="row mb-3">
                                  <div className="col-12">
                                    <TextField
                                      id="status"
                                      label="Status"
                                      select
                                      type="text"
                                      value={values.status}
                                      onChange={handleChange('status')}
                                      onBlur={handleBlur}
                                      variant="outlined"
                                      error={errors.status && touched.status}
                                      helperText={
                                        errors.status && touched.status
                                          ? errors.status
                                          : null
                                      }
                                    >
                                      {EMP_CONST.Issue_TYPE.map((obj) => (
                                        <MenuItem
                                          key={obj.value}
                                          value={obj.value}
                                        >
                                          {obj.label}
                                        </MenuItem>
                                      ))}
                                    </TextField>
                                  </div>
                                </div>

                                <div className="row mb-3">
                                  <div className="col-12">
                                    <TextField
                                      id="resolution"
                                      label="Resolution"
                                      type="text"
                                      multiline
                                      rows={2}
                                      value={values.resolution}
                                      onChange={handleChange}
                                      variant="outlined"
                                      error={
                                        errors.resolution && touched.resolution
                                      }
                                      helperText={
                                        errors.resolution && touched.resolution
                                          ? errors.resolution
                                          : null
                                      }
                                    />
                                  </div>
                                </div>

                                <div className="row mb-3">
                                  <div className="col-12">
                                    <MuiPickersUtilsProvider
                                      utils={DateFnsUtils}
                                    >
                                      <DatePicker
                                        inputVariant="outlined"
                                        autoOk
                                        label="Resolved Date"
                                        disableFuture
                                        value={resolvedDate}
                                        onChange={handleResolvedDateChange}
                                        format="dd/MM/yyyy"
                                        animateYearScrolling
                                        className="hpr-exe-service-fDate-txt-wrapper"
                                        InputProps={{
                                          endAdornment: (
                                            <FontAwesomeIcon icon="calendar-alt" />
                                          ),
                                        }}
                                      />
                                    </MuiPickersUtilsProvider>
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
                                onClick={closeChangeStatusModal}
                              >
                                No
                              </Button>
                              {/* Primary Button Area */}
                              <Button
                                variant="outlined"
                                className="modal-primary-btn"
                                onClick={submitForm}
                              >
                                Yes
                              </Button>
                            </DialogActions>
                          </Form>
                        )}
                      />
                    </Dialog>
                  )}
                </div>
              )}
            </div>
          ))}
      </div>
    </Fragment>
  );

  return getIssuesListTemplate;
});

export default GetIssuesList;
