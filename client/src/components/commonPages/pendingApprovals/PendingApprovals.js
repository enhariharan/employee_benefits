import React, { Fragment, useContext, useState, useEffect } from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import './pendingApprovals.scss';

import MenuItem from '@material-ui/core/MenuItem';
import Checkbox from '@material-ui/core/Checkbox';
import { Tooltip } from '@material-ui/core';

import update from 'immutability-helper';

import Moment from 'react-moment';

import { EMP_CONST } from '../../../services/Constants';
import ApiService from '../../../services/ApiService';
import { PubSub } from '../../../services/PubSub';
import { AuthContext } from '../../../context/AuthContext';
import { GlobalDataContext } from '../../../context/GlobalDataContext';

import PopperMenu from '../../../reUseComponents/popperMenu/PopperMenu.jsx';
import ModalWindow from '../../../reUseComponents/modalWindow/modalWindow.jsx';
import { CapitalizeFirstLetter } from '../../../reUseComponents/utils/utils';
import NoRecords from '../../../reUseComponents/noRecords/NoRecords';

import {
  BrowserRouter as Router,
  Route,
  Redirect,
  Switch,
  Link,
  useHistory,
} from 'react-router-dom';

const PendingApprovals = React.memo((props) => {
  // console.log('PendingApprovals props ', props);

  const [currentUser] = useContext(AuthContext);

  const history = useHistory();

  const [globalOnLoadData, setGlobalOnLoadData] = useContext(GlobalDataContext);

  const [tableData, setTableData] = useState([]);
  const [changeStatusEmp, setChangeStatusEmp] = useState({});

  const [checkedRows, setCheckedRows] = React.useState([]);
  const [selectedCheckBoxUuids, setSelectedCheckBoxUuids] = React.useState([]);
  const [isSelectedSameStatus, setIsSelectedSameStatus] = React.useState(false);
  const [isShowBulkCheckBox, setIsShowBulkCheckBox] = React.useState(false);
  const [
    isNoAuthorityChangeStatus,
    setIsNoAuthorityChangeStatus,
  ] = React.useState(false);

  const isSelectedCheckBox = (uuid) =>
    selectedCheckBoxUuids.indexOf(uuid) !== -1;

  useEffect(() => {
    setIsSelectedSameStatus(false);
    setCheckedRows([]);
    setSelectedCheckBoxUuids([]);

    if (tableData.length > 0) {
      setIsShowBulkCheckBox(
        tableData.every(
          (val, i, arr) => val.status === 'created' || val.status === 'resigned'
        )
      );
    }
  }, [tableData]);

  const handleSelectAllClick = (event) => {
    console.log('!isShowBulkCheckBox ', isShowBulkCheckBox);
    if (currentUser.role !== 'hr' && isShowBulkCheckBox) {
      return;
    }
    if (!!event.target.checked) {
      const newSelecteds = tableData.map((val) => val.uuid);
      const newSelectedRows = tableData
        .map((val) => {
          if (val.status === 'created' || val.status === 'resigned') {
            return {
              uuid: val.uuid,
              status: val.status,
              approvalType: 'addition',
            };
          }
        })
        .filter(Boolean);

      setCheckedRows(newSelectedRows);
      setSelectedCheckBoxUuids(newSelecteds);

      if (newSelectedRows.length > 0) {
        setIsSelectedSameStatus(
          newSelectedRows.every((val, i, arr) => val.status === arr[0].status)
        );
      } else {
        setIsSelectedSameStatus(false);
      }
      return;
    }
    setSelectedCheckBoxUuids([]);
    setCheckedRows([]);
    setIsSelectedSameStatus(false);
  };

  // Checkbox Check/Uncheck for HR/Manager/Executive Screen
  const handleClickCheckBox = (event, val) => {
    if (currentUser.role === 'executive' || currentUser.role === 'customer') {
      return false;
    }

    if (
      (currentUser.role === 'manager' &&
        (val.status === 'created' || val.status === 'resigned')) ||
      (currentUser.role === 'hr' &&
        (val.status === 'created' || val.status === 'resigned'))
    ) {
      const selectedIndex = selectedCheckBoxUuids.indexOf(val.uuid);

      let newSelected = [];

      if (selectedIndex === -1) {
        newSelected = newSelected.concat(selectedCheckBoxUuids, val.uuid);
      } else if (selectedIndex === 0) {
        newSelected = newSelected.concat(selectedCheckBoxUuids.slice(1));
      } else if (selectedIndex === selectedCheckBoxUuids.length - 1) {
        newSelected = newSelected.concat(selectedCheckBoxUuids.slice(0, -1));
      } else if (selectedIndex > 0) {
        newSelected = newSelected.concat(
          selectedCheckBoxUuids.slice(0, selectedIndex),
          selectedCheckBoxUuids.slice(selectedIndex + 1)
        );
      }

      setSelectedCheckBoxUuids(newSelected);

      if (!!event.target.checked) {
        newSelected.forEach((itemId) => {
          let checkIndex = checkedRows.findIndex((x) => x.uuid === itemId);
          if (checkIndex === -1) {
            let addToOldArray = [
              ...checkedRows,
              {
                uuid: val.uuid,
                status: val.status,
                approvalType: 'addition',
              },
            ];
            setCheckedRows(addToOldArray);
            setIsSelectedSameStatus(
              addToOldArray.every((val, i, arr) => val.status === arr[0].status)
            );
          }
        });
      } else {
        let updatedCheckedRows = checkedRows.filter(
          (item) => item.uuid !== val.uuid
        );
        setCheckedRows(updatedCheckedRows);
        if (updatedCheckedRows.length > 0) {
          setIsSelectedSameStatus(
            updatedCheckedRows.every(
              (val, i, arr) => val.status === arr[0].status
            )
          );
        } else {
          setIsSelectedSameStatus(false);
        }
      }
    }
  };

  let isEmpTypeDependant;
  !!props.data.type &&
  props.data.type.toLowerCase() === EMP_CONST.EMPOYEE_TYPE[1].toLowerCase()
    ? (isEmpTypeDependant = true)
    : (isEmpTypeDependant = false);

  useEffect(() => {
    setTableData(props.flexTableArray);
  });

  const changeStatusModal = (e, obj, i) => {
    e.preventDefault();
    setChangeStatusEmp({}); // closing open poppers
    setChangeStatusEmp({ [`row_${i}`]: true });
    setIsClickTableAction({});
  };
  const listenPAStatus = (e) => {};
  const changeStatusModalSubmit = (e, obj, nextStatus, index) => {
    setChangeStatusEmp({});
    let putData = {
      uuid: obj.uuid,
      status: nextStatus,
      approvalType: obj.approvalType,
    };

    let dynamicUrl = `${EMP_CONST.URL.exe_createCustomers}`;
    if (isEmpTypeDependant) {
      dynamicUrl = `${dynamicUrl}/dependents`;
    }

    ApiService.put(dynamicUrl, putData)
      .then((response) => {
        // console.log('response change employee status ', response);
        if (typeof response !== 'undefined') {
          setTableData([...tableData, (tableData[index].status = nextStatus)]);
          getNotifactionCount();
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
  const editUserDetails = (e, obj) => {
    // history.push(props.propObj.redirectURL);
    history.push({
      pathname: !isEmpTypeDependant
        ? `${props.data.editEmployeePath}/${obj.empid}`
        : `${props.data.editDependantPath}/edit-dependant/${obj.firstName}`,
      state: { currentObj: obj },
    });
  };

  const tableActionTemplate = (obj, i) => {
    // console.log('tableActionTemplate obj ', obj);
    let empid = obj.empid;
    let headings = {
      ...props.data,
      id: !isEmpTypeDependant ? obj.empid : obj.firstName,
    };
    return (
      <Fragment>
        {/* <pre>{JSON.stringify(obj.status)}</pre> */}
        <MenuItem>
          <Link
            to={{
              pathname: !isEmpTypeDependant
                ? `${props.data.detailsPath}/${empid}`
                : `${props.data.detailsPath}/${obj.firstName}`,
              state: { headings: headings, tableData: obj },
            }}
          >
            <FontAwesomeIcon icon="eye" className="mr-2" /> View details
          </Link>
        </MenuItem>
        {(currentUser.role === 'hr' &&
          (obj.status === 'created' || obj.status === 'resigned')) ||
        (currentUser.role === 'manager' &&
          (obj.status === 'created' || obj.status === 'resigned')) ? (
          <MenuItem>
            {/* <pre>{JSON.stringify(obj.status)}</pre> */}
            <a onClick={(e) => changeStatusModal(e, obj, i)}>
              <FontAwesomeIcon icon="pencil-alt" className="mr-2" /> Change
              status
            </a>
          </MenuItem>
        ) : null}

        {currentUser.role === 'hr' && obj.status === 'created' ? (
          <MenuItem>
            <a onClick={(e) => editUserDetails(e, obj)}>
              <FontAwesomeIcon icon="user-edit" className="mr-2" /> Edit details
            </a>
          </MenuItem>
        ) : null}
      </Fragment>
    );
  };

  useEffect(() => {}, []);

  const getNotifactionCount = () => {
    ApiService.get(`${EMP_CONST.URL.get_pending_action_notifications}`)
      .then((response) => {
        if (
          typeof response !== 'undefined' &&
          !!response.data &&
          Object.keys(response.data).length > 0
        ) {
          let notifyNum = Object.values(response.data).reduce(
            (a, b) => a + b,
            0
          );

          const pendingActionsData = update(globalOnLoadData, {
            ['pendingActionsData']: {
              $set: response.data,
            },
            ['notificationCount']: {
              $set: notifyNum,
            },
          });
          setGlobalOnLoadData(pendingActionsData);
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

  const [isClickBulkCS, setIsClickBulkCS] = React.useState(false);
  const [bulkNextStatus, setBulkNextStatus] = React.useState(0);

  const clickBulkStatus = () => {
    setIsClickBulkCS(true);
    setBulkNextStatus(EMP_CONST.ADDITION_STATUS.indexOf(checkedRows[0].status));
  };

  const bulkCustomerSuccess = (response, updatedCheckedRows, nextStatus) => {
    if (
      !!response.data.failedCustomers &&
      response.data.failedCustomers.length > 0
    ) {
      updatedCheckedRows.map((val, index) => {
        let failedCustomers = response.data.failedCustomers;

        let isExitsIDFailed = failedCustomers.findIndex(
          (x) => x.uuid === val.uuid
        );
        if (isExitsIDFailed < 0) {
          let tableDataIndex = tableData.findIndex((x) => x.uuid === val.uuid);
          setTableData([
            ...tableData,
            (tableData[tableDataIndex].status = nextStatus),
          ]);
        }
      });
    } else {
      updatedCheckedRows.map((val, index) => {
        let tableDataIndex = tableData.findIndex((x) => x.uuid === val.uuid);
        setTableData([
          ...tableData,
          (tableData[tableDataIndex].status = nextStatus),
        ]);
      });
    }
  };

  const bulkDependentSuccess = (response, updatedCheckedRows, nextStatus) => {
    if (
      !!response.data.failedDependents &&
      response.data.failedDependents.length > 0
    ) {
      updatedCheckedRows.map((val, index) => {
        let failedDependents = response.data.failedDependents;

        let isExitsIDFailed = failedDependents.findIndex(
          (x) => x.uuid === val.uuid
        );
        if (isExitsIDFailed < 0) {
          let tableDataIndex = tableData.findIndex((x) => x.uuid === val.uuid);
          setTableData([
            ...tableData,
            (tableData[tableDataIndex].status = nextStatus),
          ]);
        }
      });
    } else {
      updatedCheckedRows.map((val, index) => {
        let tableDataIndex = tableData.findIndex((x) => x.uuid === val.uuid);
        setTableData([
          ...tableData,
          (tableData[tableDataIndex].status = nextStatus),
        ]);
      });
    }
  };

  const listenNoAuthorityModel = () => {};

  const submitNoAuthorityModel = () => {
    setIsNoAuthorityChangeStatus(false);
  };

  const changeBulkStatus = (e, nextStatus) => {
    // console.log('nextStatus ', nextStatus);
    setIsClickBulkCS(false);
    setSelectedCheckBoxUuids([]);
    setCheckedRows([]);
    setIsSelectedSameStatus(false);

    // Checking Manager/Executive
    let isStatusChangeAutority;

    // console.log('currentUser _--- ', currentUser);
    if (currentUser.role === 'executive') {
      isStatusChangeAutority = checkedRows.some((obj) => {
        return obj.status === 'created' || obj.status === 'tpa approved';
      });
    }

    if (currentUser.role === 'manager') {
      isStatusChangeAutority = checkedRows.some((obj) => {
        return obj.status === 'tpa approved';
      });
    }

    if (!!isStatusChangeAutority) {
      setIsNoAuthorityChangeStatus(true);
      return;
    }

    let updatedCheckedRows = checkedRows.map((obj) => ({
      ...obj,
      status: nextStatus,
    }));

    let dynamicUrl;
    if (currentUser.role === 'hr' || currentUser.role === 'customer') {
      if (!!isEmpTypeDependant) {
        dynamicUrl = `${EMP_CONST.URL.hr_bulkStatusDependent}${currentUser.corporateUuid}`;
      } else {
        dynamicUrl = `${EMP_CONST.URL.hr_bulkStatusCustomer}${currentUser.corporateUuid}`;
      }
    } else {
      if (!!isEmpTypeDependant) {
        dynamicUrl = `${EMP_CONST.URL.hr_bulkStatusDependent}${props.data.corporateObj.uuid}`;
      } else {
        dynamicUrl = `${EMP_CONST.URL.hr_bulkStatusCustomer}${props.data.corporateObj.uuid}`;
      }
    }

    ApiService.put(dynamicUrl, updatedCheckedRows)
      .then((response) => {
        // console.log('response change employee status ', response);
        if (
          typeof response !== 'undefined' &&
          !!response.data &&
          Object.keys(response.data).length > 0
        ) {
          getNotifactionCount();

          if (!isEmpTypeDependant) {
            bulkCustomerSuccess(response, updatedCheckedRows, nextStatus);
          } else {
            bulkDependentSuccess(response, updatedCheckedRows, nextStatus);
          }
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

  const closeBulkCS = (e) => {
    setIsClickBulkCS(false);
    setSelectedCheckBoxUuids([]);
    setCheckedRows([]);
    setIsSelectedSameStatus(false);
  };

  const pendingApprovalsTemplate = (
    <Fragment>
      {/* <pre>{JSON.stringify(!!isEmpTypeDependant, null, 1)}</pre> */}
      {/* <pre>{JSON.stringify(selectedCheckBoxUuids, null, 1)}</pre> */}
      {/* <pre>{JSON.stringify(isShowBulkCheckBox, null, 1)}</pre> */}
      <div class="hpr-flex-table hpr-flex-table--collapse">
        <div class="hpr-flex-table-row hpr-flex-table-row--head">
          {currentUser.role !== 'customer' && (
            <div
              style={{ width: '15%' }}
              class="hpr-flex-table-cell hpr-flex-table-column-heading"
            >
              <Checkbox
                className={`listTableCheckBox`}
                checked={
                  Array.isArray(selectedCheckBoxUuids) &&
                  selectedCheckBoxUuids.length > 0
                    ? selectedCheckBoxUuids.length === tableData.length
                      ? true
                      : false
                    : false
                }
                onClick={handleSelectAllClick}
              ></Checkbox>

              <Tooltip
                style={{
                  pointerEvents:
                    (Array.isArray(selectedCheckBoxUuids) &&
                      selectedCheckBoxUuids.length === 0) ||
                    !isSelectedSameStatus
                      ? 'none'
                      : 'initial',
                }}
                title="Change Status"
                className={`hpr-bulk-status-wrapper ${
                  (Array.isArray(selectedCheckBoxUuids) &&
                    selectedCheckBoxUuids.length === 0) ||
                  !isSelectedSameStatus
                    ? 'hpr-disabled-element'
                    : ''
                }`}
              >
                <span onClick={clickBulkStatus}>
                  <FontAwesomeIcon icon="user-edit" />
                </span>
              </Tooltip>

              {!!isClickBulkCS && (
                <ModalWindow
                  dataModel={{
                    title: 'Change status of selected Ids',
                    description: `<span class='modal-description'>Do you need update the status to " ${
                      EMP_CONST.ADDITION_STATUS[bulkNextStatus] === 'resigned'
                        ? EMP_CONST.DELETION_STATUS[1]
                        : EMP_CONST.ADDITION_STATUS[bulkNextStatus + 1]
                    }" ?</span>`,
                    primaryBtnTxt: 'Yes',
                    secondaryBtnTxt: 'No',
                  }}
                  closeModal={closeBulkCS}
                  submitModal={(e) =>
                    changeBulkStatus(
                      e,
                      EMP_CONST.ADDITION_STATUS[bulkNextStatus] === 'resigned'
                        ? EMP_CONST.DELETION_STATUS[1]
                        : EMP_CONST.ADDITION_STATUS[bulkNextStatus + 1]
                    )
                  }
                  modalOpen={isClickBulkCS}
                  handleResponse={listenPAStatus}
                />
              )}
            </div>
          )}

          <div
            style={{ width: '25%' }}
            class="hpr-flex-table-cell hpr-flex-table-column-heading"
          >
            Emp Id
          </div>

          <div
            style={{ width: '20%' }}
            class="hpr-flex-table-cell hpr-flex-table-column-heading"
          >
            Full Name
          </div>
          {!!isEmpTypeDependant && (
            <div
              style={{ width: '15%' }}
              class="hpr-flex-table-cell hpr-flex-table-column-heading"
            >
              Relationship
            </div>
          )}
          <div
            style={{ width: !isEmpTypeDependant ? '15%' : '20%' }}
            class="hpr-flex-table-cell hpr-flex-table-column-heading"
          >
            DOB
          </div>

          <div
            style={{ width: !isEmpTypeDependant ? '15%' : '20%' }}
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
        <Fragment>
          {(tableData.length == 0 || !props.data.isClickGo) && (
            <NoRecords></NoRecords>
          )}
          {tableData.length > 0 &&
            !!props.data.isClickGo &&
            tableData.map((val, index) => {
              let additionStatusCurrentIndex = EMP_CONST.ADDITION_STATUS.indexOf(
                val.status
              );
              let deletionStatusCurrentIndex = EMP_CONST.DELETION_STATUS.indexOf(
                val.status
              );
              const isItemSelected = isSelectedCheckBox(val.uuid);

              return (currentUser.role === 'hr' &&
                (val.status === 'created' || val.status === 'resigned')) ||
                (currentUser.role === 'executive' &&
                  val.status === 'pending insurer approval') ||
                (currentUser.role === 'manager' &&
                  (val.status === 'created' || val.status === 'resigned')) ? (
                <div class="hpr-flex-table-row">
                  <div style={{ width: '15%' }} class="hpr-flex-table-cell">
                    <div class="hpr-flex-table-cell--heading"></div>
                    <div class="hpr-flex-table-cell--content access-link-content">
                      <Checkbox
                        className="listTableCheckBox"
                        checked={isItemSelected}
                        onClick={(event) => handleClickCheckBox(event, val)}
                      ></Checkbox>
                    </div>
                  </div>

                  <div
                    style={{ width: '25%' }}
                    class="hpr-flex-table-cell hpr-flex-table-topic-cell"
                  >
                    <div class="hpr-flex-table-cell--content date-content">
                      <span class="webinar-date">{val.empid}</span>
                    </div>
                  </div>

                  <div style={{ width: '20%' }} class="hpr-flex-table-cell">
                    <div class="hpr-flex-table-cell--heading">Full Name</div>
                    <div class="hpr-flex-table-cell--content title-content">
                      {val.firstName} {val.lastName}
                    </div>
                  </div>

                  {!!isEmpTypeDependant && (
                    <div style={{ width: '15%' }} class="hpr-flex-table-cell">
                      <div class="hpr-flex-table-cell--heading">
                        Relationship
                      </div>
                      <div class="hpr-flex-table-cell--content title-content">
                        {val.relationship}
                      </div>
                    </div>
                  )}

                  <div
                    style={{ width: !isEmpTypeDependant ? '15%' : '20%' }}
                    class="hpr-flex-table-cell"
                  >
                    <div class="hpr-flex-table-cell--heading">DOB</div>
                    <div class="hpr-flex-table-cell--content access-link-content">
                      <Moment format="DD/MM/YYYY">{`${val.dob}`}</Moment>
                    </div>
                  </div>

                  <div
                    style={{ width: !isEmpTypeDependant ? '15%' : '20%' }}
                    class="hpr-flex-table-cell"
                  >
                    <div class="hpr-flex-table-cell--heading">Status</div>
                    <div class="hpr-flex-table-cell--content replay-link-content">
                      {val.status}
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
                      <ModalWindow
                        dataModel={{
                          title: 'Change status',
                          description: `<span class='modal-description'>Do you need update the status to " ${
                            EMP_CONST.ADDITION_STATUS[
                              additionStatusCurrentIndex
                            ] === 'resigned'
                              ? EMP_CONST.DELETION_STATUS[1]
                              : CapitalizeFirstLetter(
                                  val.approvalType === 'addition'
                                    ? EMP_CONST.ADDITION_STATUS[
                                        additionStatusCurrentIndex + 1
                                      ]
                                    : null
                                )
                          }" ?</span>`,
                          primaryBtnTxt: 'Yes',
                          secondaryBtnTxt: 'No',
                        }}
                        closeModal={closeChangeStatusModal}
                        submitModal={(e) =>
                          changeStatusModalSubmit(
                            e,
                            val,
                            val.approvalType === 'addition'
                              ? EMP_CONST.ADDITION_STATUS[
                                  additionStatusCurrentIndex + 1
                                ]
                              : EMP_CONST.DELETION_STATUS[
                                  deletionStatusCurrentIndex + 1
                                ],
                            index
                          )
                        }
                        modalOpen={changeStatusEmp[`row_${index}`]}
                        handleResponse={listenPAStatus}
                      />
                    )}
                  </div>
                </div>
              ) : null;
            })}

          {!!isNoAuthorityChangeStatus && (
            <ModalWindow
              dataModel={{
                title: 'Alert',
                description: `<span class='modal-description hrp-error-text-elem'>You have no authority to change the current status!</span>`,
                primaryBtnTxt: 'Close',
              }}
              submitModal={submitNoAuthorityModel}
              modalOpen={isNoAuthorityChangeStatus}
              handleResponse={listenNoAuthorityModel}
            />
          )}
        </Fragment>
      </div>
    </Fragment>
  );

  return pendingApprovalsTemplate;
});

export default PendingApprovals;
