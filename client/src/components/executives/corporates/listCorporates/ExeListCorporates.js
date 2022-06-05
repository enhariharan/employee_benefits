import React, { Fragment, useContext, useState, useEffect } from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './exeListCorporates.scss';
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

import MenuItem from '@material-ui/core/MenuItem';

import { PubSub } from '../../../../services/PubSub';
import ApiService from '../../../../services/ApiService';
import { EMP_CONST } from '../../../../services/Constants';
import { AuthContext } from '../../../../context/AuthContext';

import PopperMenu from '../../../../reUseComponents/popperMenu/PopperMenu.jsx';
import ModalWindow from '../../../../reUseComponents/modalWindow/modalWindow.jsx';
import {
  CapitalizeFirstLetter,
  CapitalizeFirstLetterEveryWord,
} from '../../../../reUseComponents/utils/utils';

import Moment from 'react-moment';

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

// For Slide Modal Window
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="down" ref={ref} {...props} />;
});

const ExeListCorporates = React.memo((props) => {
  // console.log('ExeListCorporates props ', props);
  const [currentUser] = useContext(AuthContext);
  const [isMobile, setIsMobile] = useState(null);
  const [corporatesData, setCorporatesData] = useState([]);

  const history = useHistory();

  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));

  const [isClickTableAction, setIsClickTableAction] = React.useState({});
  const [anchorElItemPop, setAnchorElItemPop] = React.useState({});

  const handleClickTableAction = (event, index) => {
    setIsClickTableAction({ [`row_${index}`]: true });
    setAnchorElItemPop({ [`row_${index}`]: event.currentTarget });
  };

  const handleTableActionClose = (e, index) => {
    setIsClickTableAction({ [`row_${index}`]: false });
  };

  const [isClickApproveCoporate, setIsClickApproveCoporate] = React.useState(
    {}
  );
  const changeStatusModal = (e, obj, i) => {
    setIsClickTableAction({}); // closing open poppers
    setIsClickApproveCoporate({}); // closing open Models
    setIsClickApproveCoporate({ [`row_${i}`]: true });
  };
  const closeStatusModal = (e) => {
    setIsClickApproveCoporate({});
  };
  const listenCorporateStatus = (e) => {};

  const [executivesData, setExecutivesData] = useState([]);
  const [changeExecutive, setChangeExecutive] = useState({});
  const changeExecutiveModal = (e, obj, i) => {
    setIsClickTableAction({}); // closing open poppers
    setChangeExecutive({}); // closing open Models
    setChangeExecutive({ [`row_${i}`]: true });
    getListExecutives();
  };

  const closeExecutiveModal = (e) => {
    setIsClickTableAction({});
    setChangeExecutive({}); // closing open Models
  };

  const editCorporateDetails = (e, obj) => {
    let changeToLowercaseCorp = `${obj.displayName}`.toLowerCase();
    history.push({
      pathname: `edit-corporate/${changeToLowercaseCorp}`,
      state: { currentObj: obj },
    });
  };

  const changeCoporateStatus = (e, obj, i) => {
    let putData = {
      uuid: obj.uuid,
      status: 'approved',
    };

    ApiService.put(`${EMP_CONST.URL.exe_getCorporates}`, putData)
      .then((response) => {
        // console.log('response changeCoporateStatus ', response);
        if (typeof response !== 'undefined' && !!response.data) {
          if (response.errCode === 'Success') {
            let newCorporateArray = [...corporatesData];
            newCorporateArray[i] = {
              ...newCorporateArray[i],
              status: 'approved',
            };
            setCorporatesData(newCorporateArray);

            let respNotiObj = {
              message: 'Successfully approved',
              color: 'success',
            };
            PubSub.publish(PubSub.events.SNACKBAR_PROVIDER, respNotiObj);
          } else {
            let respNotiObj = {
              message: response.data,
              color: 'error',
            };
            PubSub.publish(PubSub.events.SNACKBAR_PROVIDER, respNotiObj);
          }
        }
      })
      .catch((err) => {
        console.log(`Resend Error ${JSON.stringify(err)} `);
        if (!!err.data && (!!err.data.message || !!err.data.errCode)) {
          let respNotiObj = {
            message: err.data.message || err.data.errCode,
            color: 'error',
          };
          PubSub.publish(PubSub.events.SNACKBAR_PROVIDER, respNotiObj);
        }
      })
      .finally(() => {
        console.log(`Finally `);
        setIsClickApproveCoporate(false);
      });
  };

  const tableActionTemplate = (obj, i) => {
    // console.log('obj tableActionTemplate ', obj);
    let corporateName = obj.displayName;
    let headings = {
      pageHeading: 'View Details',
      detailsPath: '/executive-home/corporates/list-corporates',
      id: obj.displayName,
    };
    return (
      <Fragment>
        <MenuItem>
          <Link
            to={{
              pathname: `${props.location.pathname}/${corporateName}`,
              state: { headings: headings, tableData: obj },
            }}
          >
            <FontAwesomeIcon icon="eye" className="mr-2" /> View details
          </Link>
        </MenuItem>

        {`${obj.status}`.toLowerCase() === 'new' &&
          currentUser.role === 'manager' && (
            <MenuItem>
              <a onClick={(e) => changeStatusModal(e, obj, i)}>
                <FontAwesomeIcon icon="check-circle" className="mr-2" /> Approve
                corporate
              </a>
            </MenuItem>
          )}

        {(currentUser.role === 'executive' || currentUser.role === 'manager') &&
          obj.status === 'new' && (
            <MenuItem>
              <a onClick={(e) => editCorporateDetails(e, obj)}>
                <FontAwesomeIcon icon="building" className="mr-2" /> Edit
                corporate
              </a>
            </MenuItem>
          )}

        {currentUser.role === 'manager' && (
          <MenuItem>
            <a onClick={(e) => changeExecutiveModal(e, obj, i)}>
              <FontAwesomeIcon icon="user-tie" className="mr-2" /> Change
              executive
            </a>
          </MenuItem>
        )}
      </Fragment>
    );
  };

  useEffect(() => {
    getListCorporates();

    PubSub.subscribe(PubSub.events.IS_MOBILE, (flag) => {
      setIsMobile(flag);
    });
    return () => {
      PubSub.unsubscribe(PubSub.events.IS_MOBILE);
    };
  }, []);

  const getListExecutives = () => {
    if (currentUser === null) {
      return;
    }
    ApiService.get(
      `${EMP_CONST.URL.exe_getExecutives}?brokingCompanyUuid=${currentUser.brokingCompanyUuid}`
    )
      .then((response) => {
        console.log('response getListExecutives ', response);
        if (typeof response !== 'undefined') {
          setExecutivesData(response.data);
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

  const currentStatusCheck = (status) => {
    let statusChangeToLowerCase = `${status}`.toLowerCase();
    switch (statusChangeToLowerCase) {
      case 'new':
        return <span className="table-status __created">Created</span>;
      case 'approved':
        return <span className="table-status __active">Approved</span>;
      default:
        break;
    }
  };

  const getListCorporates = () => {
    if (currentUser === null) {
      return;
    }
    ApiService.get(`${EMP_CONST.URL.exe_getCorporates}`)
      .then((response) => {
        // console.log('response getListCorporates ', response);
        if (typeof response !== 'undefined') {
          setCorporatesData(response.data);
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

  const exeListCorporatesTemplate = (
    <Fragment>
      <div className="hpr_pageHeadingWrapper">
        <div className="hpr_page-heading-left-wrapper">
          {!!isMobile && (
            <div className="hpr-breadcrumb-wrapper">
              <Link to={'/executive-home'}>
                <FontAwesomeIcon icon="chevron-left" className="mr-1" />
                Back
              </Link>
            </div>
          )}
          <h3 className="">List Corporates</h3>
        </div>
      </div>

      <div className="row">
        <div className="col-12">
          <div class="hpr-flex-table hpr-flex-table--collapse">
            <div class="hpr-flex-table-row hpr-flex-table-row--head">
              <div
                style={{ width: '30%' }}
                class="hpr-flex-table-cell hpr-flex-table-column-heading"
              >
                Company Name
              </div>
              <div
                style={{ width: '20%' }}
                class="hpr-flex-table-cell hpr-flex-table-column-heading"
              >
                Executive
              </div>
              <div
                style={{ width: '15%' }}
                class="hpr-flex-table-cell hpr-flex-table-column-heading"
              >
                Domain Name
              </div>
              <div
                style={{ width: '15%' }}
                class="hpr-flex-table-cell hpr-flex-table-column-heading"
              >
                City
              </div>

              <div
                style={{ width: '10%' }}
                class="hpr-flex-table-cell hpr-flex-table-column-heading"
              >
                Status
              </div>

              <div
                style={{ width: '10%' }}
                class="hpr-flex-table-cell hpr-flex-table-column-heading"
              >
                Actions
              </div>
            </div>

            {!!corporatesData &&
              corporatesData.length > 0 &&
              corporatesData.map((val, index) => (
                <div class="hpr-flex-table-row">
                  <div
                    style={{ width: '30%' }}
                    class="hpr-flex-table-cell hpr-flex-table-topic-cell"
                  >
                    <div class="hpr-flex-table-cell--content date-content">
                      <span class="webinar-date">{val.companyName}</span>
                    </div>
                  </div>
                  <div style={{ width: '20%' }} class="hpr-flex-table-cell">
                    <div class="hpr-flex-table-cell--heading">Created Date</div>
                    <div class="hpr-flex-table-cell--content title-content">
                      {val['linkedExecutives'].map((value, index) => {
                        return (
                          <div>
                            {CapitalizeFirstLetterEveryWord(value.firstName)}{' '}
                            {CapitalizeFirstLetterEveryWord(value.lastName)}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                  <div style={{ width: '15%' }} class="hpr-flex-table-cell">
                    <div class="hpr-flex-table-cell--heading">State</div>
                    <div class="hpr-flex-table-cell--content access-link-content">
                      {val.displayName}
                    </div>
                  </div>
                  <div style={{ width: '15%' }} class="hpr-flex-table-cell">
                    <div class="hpr-flex-table-cell--heading">City</div>
                    <div class="hpr-flex-table-cell--content replay-link-content">
                      {val.branchAddressCity}
                    </div>
                  </div>

                  <div style={{ width: '10%' }} class="hpr-flex-table-cell">
                    <div class="hpr-flex-table-cell--heading">Status</div>
                    <div class="hpr-flex-table-cell--content hpr-table-status-wrapper replay-link-content">
                      {currentStatusCheck(val.status)}
                    </div>
                  </div>

                  <div style={{ width: '10%' }} class="hpr-flex-table-cell">
                    <div class="hpr-flex-table-cell--heading">Actions</div>
                    <div class="hpr-flex-table-cell--content replay-link-content">
                      <FontAwesomeIcon
                        icon="ellipsis-v"
                        className="table-action-ellipsis-cursor"
                        onClick={(eve) => handleClickTableAction(eve, index)}
                      />
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

                      {!!isClickApproveCoporate[`row_${index}`] && (
                        <ModalWindow
                          dataModel={{
                            title: 'Change status of corporate',
                            description: `<span class='modal-description'>Do you need update the status to " <b>${CapitalizeFirstLetter(
                              'Approve'
                            )}</b>" ?</span>`,

                            primaryBtnTxt: 'Yes',
                            secondaryBtnTxt: 'No',
                          }}
                          closeModal={closeStatusModal}
                          submitModal={(e) =>
                            changeCoporateStatus(e, val, index)
                          }
                          modalOpen={isClickApproveCoporate[`row_${index}`]}
                          handleResponse={listenCorporateStatus}
                        />
                      )}

                      {!!changeExecutive[`row_${index}`] && (
                        <Dialog
                          disableBackdropClick
                          disableEscapeKeyDown
                          fullScreen={fullScreen}
                          className="hpr-reply-issue-dialog"
                          open={changeExecutive[`row_${index}`]}
                          TransitionComponent={Transition}
                          onClose={closeExecutiveModal}
                          aria-labelledby="responsive-dialog-title"
                        >
                          <Formik
                            // enableReinitialize
                            initialValues={{
                              executiveUuid: '',
                            }}
                            validationSchema={Yup.object().shape({
                              executiveUuid: Yup.string().required('Required'),
                            })}
                            onSubmit={(
                              values,
                              { setSubmitting, resetForm }
                            ) => {
                              setChangeExecutive({});

                              let putData = {
                                ...values,
                                corporateUuid: val.uuid,
                              };

                              let dynamicUrl = `${EMP_CONST.URL.exe_updateExecutive}`;

                              ApiService.put(dynamicUrl, putData)
                                .then((response) => {
                                  if (typeof response !== 'undefined') {
                                    let changedExecutiveObj = executivesData.filter(
                                      (el) =>
                                        el.uuid === response.data.executiveUuid
                                    );

                                    let newArray = [...corporatesData];

                                    newArray[index].linkedExecutives[0] = {
                                      ...newArray[index].linkedExecutives[0],
                                      firstName:
                                        changedExecutiveObj[0].firstName,
                                      lastName: changedExecutiveObj[0].lastName,
                                      uuid: changedExecutiveObj[0].uuid,
                                    };
                                    setCorporatesData(newArray);
                                  }
                                })
                                .catch((err) => {
                                  if (
                                    !!err.data &&
                                    (!!err.data.errCode || !!err.data.message)
                                  ) {
                                    let respNotiObj = {
                                      message:
                                        err.data.message || err.data.errCode,
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
                                  closeExecutiveModal();
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
                                  Change Executive
                                </DialogTitle>

                                <DialogContent>
                                  <DialogContentText>
                                    <div className="row mb-3">
                                      <div className="col-12">
                                        <span
                                          class="modal-description"
                                          style={{ minHeight: 'auto' }}
                                        >
                                          Do you need change the current
                                          executive(
                                          <b>
                                            {CapitalizeFirstLetterEveryWord(
                                              val.linkedExecutives[0]
                                                .firstName +
                                                ' ' +
                                                val.linkedExecutives[0].lastName
                                            )}
                                          </b>{' '}
                                          )
                                        </span>
                                      </div>
                                    </div>

                                    <div className="row mb-3">
                                      <div className="col-12">
                                        <TextField
                                          id="executiveUuid"
                                          label="Select Executive"
                                          select
                                          type="text"
                                          value={values.executiveUuid}
                                          onChange={handleChange(
                                            'executiveUuid'
                                          )}
                                          error={
                                            errors.executiveUuid &&
                                            touched.executiveUuid
                                          }
                                          helperText={
                                            errors.executiveUuid &&
                                            touched.executiveUuid
                                              ? errors.executiveUuid
                                              : null
                                          }
                                        >
                                          {executivesData.map((obj) => (
                                            <MenuItem
                                              key={obj.uuid}
                                              value={obj.uuid}
                                            >
                                              {CapitalizeFirstLetterEveryWord(
                                                obj.firstName +
                                                  ' ' +
                                                  obj.lastName
                                              )}
                                            </MenuItem>
                                          ))}
                                        </TextField>
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
                                    onClick={closeExecutiveModal}
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
                </div>
              ))}
          </div>
        </div>
      </div>
    </Fragment>
  );

  return exeListCorporatesTemplate;
});

export default ExeListCorporates;
