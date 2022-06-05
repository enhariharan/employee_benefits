import React, { Fragment, useContext, useState, useEffect } from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import MenuItem from '@material-ui/core/MenuItem';

import Moment from 'react-moment';

import ApiService from '../../../services/ApiService';
import { EMP_CONST } from '../../../services/Constants';
import { PubSub } from '../../../services/PubSub';
import { AuthContext } from '../../../context/AuthContext';

import PopperMenu from '../../../reUseComponents/popperMenu/PopperMenu.jsx';
import ModalWindow from '../../../reUseComponents/modalWindow/modalWindow.jsx';
import NoRecords from '../../../reUseComponents/noRecords/NoRecords';

import {
  BrowserRouter as Router,
  Route,
  Redirect,
  Switch,
  Link,
  useHistory,
} from 'react-router-dom';

const GetAllDependants = React.memo((props) => {
  // console.log('GetAllDependants props ', props);

  const history = useHistory();

  const [currentUser] = useContext(AuthContext);

  const [changeStatusEmp, setChangeStatusEmp] = useState({});

  const listenPAStatus = (e) => {};
  const changeStatusModalSubmit = (e) => {
    setChangeStatusEmp({});
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

  const editDepDetails = (e, obj) => {
    // history.push(props.propObj.redirectURL);
    history.push({
      pathname: `${props.data.detailsPath}/${props.data.empId}/edit-dependant/${obj.firstName}`,
      state: { currentObj: obj, empId: props.data.empId },
    });
  };

  const tableActionTemplate = (obj, i) => {
    let headings = {
      ...props.data,
      id: obj.firstName,
      isEmpDeps: true,
    };
    return (
      <Fragment>
        <MenuItem>
          <Link
            to={{
              pathname: `${props.data.detailsPath}/${props.data.empId}/view-dependants/${obj.firstName}`,
              state: { headings: headings, tableData: obj },
            }}
          >
            <FontAwesomeIcon icon="eye" className="mr-2" /> View details
          </Link>
        </MenuItem>
        {/* {currentUser.role === 'hr' && (
          <MenuItem>
            <a onClick={(e) => editDepDetails(e, obj)}>
              <FontAwesomeIcon icon="user-edit" className="mr-2" /> Edit details
            </a>
          </MenuItem>
        )} */}
      </Fragment>
    );
  };

  useEffect(() => {}, []);

  const getAllDependantsTemplate = (
    <Fragment>
      <div class="hpr-flex-table hpr-flex-table--collapse">
        <div class="hpr-flex-table-row hpr-flex-table-row--head">
          <div
            style={{ width: '15%' }}
            class="hpr-flex-table-cell hpr-flex-table-column-heading"
          >
            Relation
          </div>
          <div
            style={{ width: '15%' }}
            class="hpr-flex-table-cell hpr-flex-table-column-heading"
          >
            Full Name
          </div>
          <div
            style={{ width: '15%' }}
            class="hpr-flex-table-cell hpr-flex-table-column-heading"
          >
            DOB
          </div>
          <div
            style={{ width: '30%' }}
            class="hpr-flex-table-cell hpr-flex-table-column-heading"
          >
            Email
          </div>
          {/* <div
            style={{ width: '12%' }}
            class="hpr-flex-table-cell hpr-flex-table-column-heading"
          >
            City
          </div> */}
          <div
            style={{ width: '15%' }}
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

        {props.flexTableArray.length == 0 && <NoRecords></NoRecords>}

        {props.flexTableArray.length > 0 &&
          props.flexTableArray.map((val, index) => (
            <div class="hpr-flex-table-row">
              <div
                style={{ width: '15%' }}
                class="hpr-flex-table-cell hpr-flex-table-topic-cell"
              >
                <div class="hpr-flex-table-cell--content date-content">
                  <span class="webinar-date">{val.relationship}</span>
                </div>
              </div>
              <div style={{ width: '15%' }} class="hpr-flex-table-cell">
                <div class="hpr-flex-table-cell--heading">Full Name</div>
                <div class="hpr-flex-table-cell--content title-content">
                  {val.firstName} {val.lastName}
                </div>
              </div>
              <div style={{ width: '15%' }} class="hpr-flex-table-cell">
                <div class="hpr-flex-table-cell--heading">DOB</div>
                <div class="hpr-flex-table-cell--content access-link-content">
                  <Moment format="DD/MM/YYYY">{`${val.dob}`}</Moment>
                </div>
              </div>
              <div style={{ width: '30%' }} class="hpr-flex-table-cell">
                <div class="hpr-flex-table-cell--heading">Email</div>
                <div class="hpr-flex-table-cell--content replay-link-content">
                  {val.contactEmail}
                </div>
              </div>
              {/* <div style={{ width: '12%' }} class="hpr-flex-table-cell">
                <div class="hpr-flex-table-cell--heading">City</div>
                <div class="hpr-flex-table-cell--content replay-link-content">
                  {val.addressCity}
                </div>
              </div> */}

              <div style={{ width: '15%' }} class="hpr-flex-table-cell">
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
                      description: `<span class='modal-description'>Do you need update the current status ?</span>`,
                      primaryBtnTxt: 'Yes',
                      secondaryBtnTxt: 'No',
                    }}
                    closeModal={closeChangeStatusModal}
                    submitModal={changeStatusModalSubmit}
                    modalOpen={changeStatusEmp[`row_${index}`]}
                    handleResponse={listenPAStatus}
                  />
                )}
              </div>
            </div>
          ))}
      </div>
    </Fragment>
  );

  return getAllDependantsTemplate;
});

export default GetAllDependants;
