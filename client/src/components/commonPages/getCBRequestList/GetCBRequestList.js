import React, { Fragment, useContext, useState, useEffect } from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import MenuItem from '@material-ui/core/MenuItem';

import { Link } from 'react-router-dom';

import Moment from 'react-moment';
import MomentReg from 'moment';

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

import '../getIssuesList/getIssuesList.scss';
import '../../../reUseComponents/modalWindow/modalWindow.scss';

// For Slide Modal Window
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="down" ref={ref} {...props} />;
});

const GetCBRequestList = React.memo((props) => {
  // console.log('GetCBRequestList props ', props);

  useEffect(() => {
    setGetAllCBRequestData(props.flexTableArray);
  }, [props.flexTableArray]);

  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));

  const [getAllCBRequestData, setGetAllCBRequestData] = useState([]);
  const [currentCBRequestObj, setCurrentCBRequestObj] = useState({});
  const [changeStatusIssue, setChangeStatusIssue] = useState({});
  const [isClickTableAction, setIsClickTableAction] = React.useState({});
  const [anchorElItemPop, setAnchorElItemPop] = React.useState({});

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
    setCurrentCBRequestObj(obj);
  };

  const closeChangeStatusModal = (e) => {
    setChangeStatusIssue({});
  };

  const changeStatusModalSubmit = (e) => {
    setChangeStatusIssue({});
  };

  const tableActionTemplate = (obj, i) => {
    let requestId = obj.requestId;
    let headings = { ...props.data, id: obj.requestId };

    return (
      <Fragment>
        <MenuItem>
          <Link
            to={{
              pathname: `${props.data.detailsPath}/${requestId}`,
              state: { headings: headings, tableData: obj },
            }}
          >
            <FontAwesomeIcon icon="eye" className="mr-2" /> View details
          </Link>
        </MenuItem>

        {obj.status === 'Pending' && (
          <MenuItem>
            <a onClick={(e) => changeStatusModal(e, obj, i)}>
              <FontAwesomeIcon icon="pencil-alt" className="mr-2" /> Reply to
              request
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

  const getCBRequestListTemplate = (
    <Fragment>
      {/* <pre>{JSON.stringify(getAllCBRequestData, null, 1)}</pre> */}
      <div class="hpr-flex-table hpr-flex-table--collapse hpr-get-all-issues-wrapper">
        <div class="hpr-flex-table-row hpr-flex-table-row--head">
          <div
            style={{ width: '12%' }}
            class="hpr-flex-table-cell hpr-flex-table-column-heading"
          >
            Insurance Type
          </div>

          <div
            style={{ width: '10%' }}
            class="hpr-flex-table-cell hpr-flex-table-column-heading"
          >
            Emp ID
          </div>

          <div
            style={{ width: '15%' }}
            class="hpr-flex-table-cell hpr-flex-table-column-heading"
          >
            Date Of Report
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

          <div
            style={{ width: '18%' }}
            class="hpr-flex-table-cell hpr-flex-table-column-heading"
          >
            Comments
          </div>

          <div
            style={{ width: '10%' }}
            class="hpr-flex-table-cell hpr-flex-table-column-heading"
          >
            Status
          </div>
          {!!props.data.isExecutive && (
            <div
              style={{ width: '8%' }}
              class="hpr-flex-table-cell hpr-flex-table-column-heading"
            >
              Actions
            </div>
          )}
        </div>

        {getAllCBRequestData.length == 0 && <NoRecords></NoRecords>}

        {getAllCBRequestData.length > 0 &&
          getAllCBRequestData.map((val, index) => (
            <div class="hpr-flex-table-row">
              <div
                style={{ width: '12%' }}
                class="hpr-flex-table-cell hpr-flex-table-topic-cell"
              >
                <div class="hpr-flex-table-cell--content date-content">
                  <span class="webinar-date">{val.insuranceType}</span>
                </div>
              </div>

              <div style={{ width: '10%' }} class="hpr-flex-table-cell">
                <div class="hpr-flex-table-cell--heading">Emp ID</div>
                <div class="hpr-flex-table-cell--content title-content">
                  {val.empid}
                </div>
              </div>

              <div style={{ width: '15%' }} class="hpr-flex-table-cell">
                <div class="hpr-flex-table-cell--heading">Date Of Report</div>
                <div class="hpr-flex-table-cell--content title-content">
                  <Moment format="DD/MM/YYYY">{`${val.dateOfReport}`}</Moment>
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

              <div style={{ width: '18%' }} class="hpr-flex-table-cell">
                <div class="hpr-flex-table-cell--heading">Comments</div>
                <div class="hpr-flex-table-cell--content title-content">
                  {val.comments}
                </div>
              </div>

              <div style={{ width: '10%' }} class="hpr-flex-table-cell">
                <div class="hpr-flex-table-cell--heading">Status</div>
                <div class="hpr-flex-table-cell--content hpr-table-status-wrapper access-link-content">
                  {/* {val.status} */}
                  {currentStatusCheck(val.status)}
                </div>
              </div>

              <div style={{ width: '8%' }} class="hpr-flex-table-cell">
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
                        comments: '',
                      }}
                      validationSchema={Yup.object().shape({
                        status: Yup.string().required('Required'),
                        comments: Yup.string().required('Required'),
                      })}
                      onSubmit={(values, { setSubmitting, resetForm }) => {
                        let postData = {
                          ...values,
                          requestId: currentCBRequestObj.requestId,
                        };

                        ApiService.put(
                          EMP_CONST.URL.exe_resolveCallback,
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

                              let indexOfObj = getAllCBRequestData.findIndex(
                                (obj) =>
                                  obj.requestId ===
                                  currentCBRequestObj.requestId
                              );

                              if (indexOfObj > -1) {
                                let newAllCBRequestData = [
                                  ...getAllCBRequestData,
                                ];
                                newAllCBRequestData[indexOfObj].status =
                                  values.status;
                                newAllCBRequestData[indexOfObj].comments =
                                  values.comments;

                                setGetAllCBRequestData(newAllCBRequestData);
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
                            Reply to {currentCBRequestObj.empid}
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
                                    id="comments"
                                    label="Comments"
                                    type="text"
                                    multiline
                                    rows={2}
                                    value={values.comments}
                                    onChange={handleChange}
                                    variant="outlined"
                                    error={errors.comments && touched.comments}
                                    helperText={
                                      errors.comments && touched.comments
                                        ? errors.comments
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
            </div>
          ))}
      </div>
    </Fragment>
  );

  return getCBRequestListTemplate;
});

export default GetCBRequestList;
