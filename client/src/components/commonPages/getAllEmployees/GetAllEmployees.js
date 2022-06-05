import React, { Fragment, useContext, useState, useEffect } from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import MenuItem from '@material-ui/core/MenuItem';

import { useTheme } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';

import DateFnsUtils from '@date-io/date-fns';
import { MuiPickersUtilsProvider, DatePicker } from '@material-ui/pickers';

import { Link } from 'react-router-dom';

import Moment from 'react-moment';

import ApiService from '../../../services/ApiService';
import { EMP_CONST } from '../../../services/Constants';
import { PubSub } from '../../../services/PubSub';

import PopperMenu from '../../../reUseComponents/popperMenu/PopperMenu.jsx';
import ModalWindow from '../../../reUseComponents/modalWindow/modalWindow.jsx';
import NoRecords from '../../../reUseComponents/noRecords/NoRecords';

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

import { CapitalizeFirstLetter } from '../../../reUseComponents/utils/utils';

// For Slide Modal Window
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="down" ref={ref} {...props} />;
});

const GetAllEmployees = React.memo((props) => {
  // console.log('GetAllEmployees props ', props);

  const [changeStatusEmp, setChangeStatusEmp] = useState({});
  const [tableData, setTableData] = useState([]);
  const [isSelectCustomer, setIsSelectCustomer] = useState(false);

  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    setTableData(props.flexTableArray);
  });
  useEffect(() => {
    setIsSelectCustomer(props.data.isSelectCustomer);
  }, [tableData]);

  const [dateOfExitDt, setDateOfExitDt] = useState(new Date());

  const handleDateOfExitChange = (e) => {
    if (!e) {
      return;
    }
    setDateOfExitDt(e);
  };

  const changeStatusModal = (e, obj, i) => {
    e.preventDefault();
    setChangeStatusEmp({}); // closing open poppers
    setChangeStatusEmp({ [`row_${i}`]: true });
    setIsClickTableAction({});
  };

  const closeChangeStatusModal = (e) => {
    // console.log('closeMoveCopyModal ', e);
    setChangeStatusEmp({});
  };

  const [isClickTableAction, setIsClickTableAction] = React.useState({});
  const [anchorElItemPop, setAnchorElItemPop] = React.useState({});

  const handleClickTableAction = (event, index) => {
    setIsClickTableAction({ [`row_${index}`]: true });
    setAnchorElItemPop({ [`row_${index}`]: event.currentTarget });
  };

  const handleTableActionClose = (e, index) => {
    setIsClickTableAction({ [`row_${index}`]: false });
  };

  const getEcard = (e, obj, data) => {
    setIsClickTableAction({});
    ApiService.get(
      `${EMP_CONST.URL.cust_policyEcard}?empid=${obj.empid}&corporateUuid=${data.corporateUuid}`
    )
      .then((response) => {
        // console.log('response PolicyECard ', response);

        if (typeof response !== 'undefined' && !!response.data.isSuccess) {
          window.open(response.data.ecardUrl, '_blank');
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

  const tableActionTemplate = (obj, i) => {
    let empid = obj.empid;
    let headings = { ...props.data, id: obj.empid };
    return (
      <Fragment>
        <MenuItem>
          <Link
            to={{
              pathname: !!isSelectCustomer
                ? `${props.data.detailsPath}/${empid}`
                : `${props.data.viewDepsPath}/${empid}/view-dependants/${obj.firstName}`,
              state: { headings: headings, tableData: obj },
            }}
          >
            <FontAwesomeIcon icon="eye" className="mr-2" /> View details
          </Link>
        </MenuItem>
        {!!isSelectCustomer && (
          <Fragment>
            <MenuItem>
              <a onClick={(e) => getEcard(e, obj, props.data)}>
                <FontAwesomeIcon icon="download" className="mr-2" /> Download
                eCard
              </a>
            </MenuItem>

            <MenuItem>
              <Link
                to={{
                  pathname: `${props.data.viewDepsPath}/${empid}/view-dependants`,
                  state: {
                    empId: empid,
                    corporateUuid: props.data.corporateUuid,
                  },
                }}
              >
                <FontAwesomeIcon icon="users" className="mr-2" /> View
                dependants
              </Link>
            </MenuItem>
          </Fragment>
        )}

        {!!props.data.currentUser.role &&
          (props.data.currentUser.role === 'hr' ||
            props.data.currentUser.role === 'executive') &&
          obj.status === 'active' && (
            <MenuItem>
              <a onClick={(e) => changeStatusModal(e, obj, i)}>
                <FontAwesomeIcon icon="pencil-alt" className="mr-2" /> Change
                status
              </a>
            </MenuItem>
          )}
      </Fragment>
    );
  };

  const getAllEmployeesTemplate = (
    <Fragment>
      {/* <pr>{JSON.stringify(isSelectCustomer)}</pr> */}
      <div className="hpr-flex-table hpr-flex-table--collapse">
        <div className="hpr-flex-table-row hpr-flex-table-row--head">
          <div
            style={{ width: '15%' }}
            className="hpr-flex-table-cell hpr-flex-table-column-heading"
          >
            Emp Id
          </div>

          <div
            style={{ width: '15%' }}
            className="hpr-flex-table-cell hpr-flex-table-column-heading"
          >
            Full Name
          </div>
          <div
            style={{ width: '15%' }}
            className="hpr-flex-table-cell hpr-flex-table-column-heading"
          >
            DOB
          </div>
          <div
            style={{ width: '25%' }}
            className="hpr-flex-table-cell hpr-flex-table-column-heading"
          >
            {!!isSelectCustomer ? 'Sum Insured' : 'Relationship'}
          </div>

          <div
            style={{ width: '20%' }}
            className="hpr-flex-table-cell hpr-flex-table-column-heading"
          >
            Status
          </div>
          <div
            style={{ width: '10%' }}
            className="hpr-flex-table-cell hpr-flex-table-column-heading"
          >
            Actions
          </div>
        </div>

        {tableData.length == 0 && <NoRecords></NoRecords>}

        {tableData.length > 0 &&
          tableData.map((val, index) => {
            let additionStatusCurrentIndex = EMP_CONST.ADDITION_STATUS.indexOf(
              val.status
            );

            return (
              <div className="hpr-flex-table-row">
                <Fragment>
                  <div
                    style={{ width: '15%' }}
                    className="hpr-flex-table-cell hpr-flex-table-topic-cell"
                  >
                    <div clclassNameass="hpr-flex-table-cell--content date-content">
                      <span className="webinar-date">{val.empid}</span>
                    </div>
                  </div>
                  <div style={{ width: '15%' }} class="hpr-flex-table-cell">
                    <div className="hpr-flex-table-cell--heading">
                      Full Name
                    </div>
                    <div className="hpr-flex-table-cell--content title-content">
                      {val.firstName} {val.lastName}
                    </div>
                  </div>
                </Fragment>

                <div style={{ width: '15%' }} class="hpr-flex-table-cell">
                  <div className="hpr-flex-table-cell--heading">DOB</div>
                  <div className="hpr-flex-table-cell--content access-link-content">
                    <Moment format="DD/MM/YYYY">{`${val.dob}`}</Moment>
                  </div>
                </div>
                <div style={{ width: '25%' }} class="hpr-flex-table-cell">
                  <div className="hpr-flex-table-cell--heading">
                    {!!isSelectCustomer ? 'Sum Insured' : 'Relationship'}
                  </div>
                  <div className="hpr-flex-table-cell--content replay-link-content">
                    {!!isSelectCustomer ? val.sumInsured : val.relationship}
                  </div>
                </div>

                <div style={{ width: '20%' }} class="hpr-flex-table-cell">
                  <div className="hpr-flex-table-cell--heading">Status</div>
                  <div className="hpr-flex-table-cell--content replay-link-content">
                    {val.status}
                  </div>
                </div>

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

                  {!!changeStatusEmp[`row_${index}`] && (
                    <Dialog
                      disableBackdropClick
                      disableEscapeKeyDown
                      fullScreen={fullScreen}
                      className="hpr-reply-issue-dialog"
                      open={changeStatusEmp[`row_${index}`]}
                      TransitionComponent={Transition}
                      onClose={closeChangeStatusModal}
                      aria-labelledby="responsive-dialog-title"
                    >
                      <Formik
                        // enableReinitialize
                        initialValues={{
                          dateOfExit: dateOfExitDt,
                        }}
                        validationSchema={Yup.object().shape({
                          dateOfExit: Yup.string().required('Required'),
                        })}
                        onSubmit={(values, { setSubmitting, resetForm }) => {
                          setChangeStatusEmp({});
                          let nextStatus =
                            EMP_CONST.ADDITION_STATUS[
                              additionStatusCurrentIndex + 1
                            ];
                          let putData = {
                            uuid: val.uuid,
                            status: nextStatus,
                            approvalType:
                              nextStatus === 'resigned'
                                ? 'deletion'
                                : 'addition',
                            dateOfExit: dateOfExitDt,
                          };

                          console.log('putData ', putData);

                          let dynamicUrl = `${EMP_CONST.URL.exe_createCustomers}`;

                          ApiService.put(dynamicUrl, putData)
                            .then((response) => {
                              if (typeof response !== 'undefined') {
                                setTableData([
                                  ...tableData,
                                  (tableData[index].status = nextStatus),
                                ]);
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
                              closeChangeStatusModal();
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
                              Change status
                            </DialogTitle>

                            <DialogContent>
                              <DialogContentText>
                                <div className="row mb-3">
                                  <div className="col-12">
                                    <span class="modal-description">
                                      Do you need update the current status "
                                      <b>
                                        {CapitalizeFirstLetter(
                                          EMP_CONST.ADDITION_STATUS[
                                            additionStatusCurrentIndex + 1
                                          ]
                                        )}
                                      </b>
                                      " ?
                                    </span>
                                  </div>
                                </div>

                                <div className="row mb-3">
                                  <div className="col-12">
                                    <MuiPickersUtilsProvider
                                      utils={DateFnsUtils}
                                    >
                                      <DatePicker
                                        id="dateOfExit"
                                        autoOk
                                        label="Date Of Exit "
                                        value={dateOfExitDt}
                                        onChange={handleDateOfExitChange}
                                        format="dd/MM/yyyy"
                                        animateYearScrolling
                                        InputProps={{
                                          endAdornment: (
                                            <FontAwesomeIcon icon="calendar-alt" />
                                          ),
                                        }}
                                        error={
                                          errors.dateOfExitDt &&
                                          touched.dateOfExitDt
                                        }
                                        helperText={
                                          errors.dateOfExitDt &&
                                          touched.dateOfExitDt
                                            ? errors.dateOfExitDt
                                            : null
                                        }
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
                                Submit
                              </Button>
                            </DialogActions>
                          </Form>
                        )}
                      />
                    </Dialog>
                  )}
                </div>
              </div>
            );
          })}
      </div>
    </Fragment>
  );

  return getAllEmployeesTemplate;
});

export default GetAllEmployees;
