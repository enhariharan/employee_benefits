import React, { Fragment, useContext, useState, useEffect } from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import MenuItem from '@material-ui/core/MenuItem';

import {
  BrowserRouter as Router,
  Route,
  Redirect,
  Switch,
  Link,
  useHistory,
} from 'react-router-dom';

import Moment from 'react-moment';

import { AuthContext } from '../../../context/AuthContext';
import { EMP_CONST } from '../../../services/Constants';
import { PubSub } from '../../../services/PubSub';
import ApiService from '../../../services/ApiService';

import PopperMenu from '../../../reUseComponents/popperMenu/PopperMenu.jsx';
import ModalWindow from '../../../reUseComponents/modalWindow/modalWindow.jsx';
import { CapitalizeFirstLetter } from '../../../reUseComponents/utils/utils';
import NoRecords from '../../../reUseComponents/noRecords/NoRecords';

const PoliciesList = React.memo((props) => {
  // console.log('PoliciesList props ', props);

  const [currentUser] = useContext(AuthContext);

  const history = useHistory();

  const [isClickTableAction, setIsClickTableAction] = React.useState({});
  const [policiesData, setPoliciesData] = React.useState([]);
  const [anchorElItemPop, setAnchorElItemPop] = React.useState({});

  const handleClickTableAction = (event, index) => {
    setIsClickTableAction({ [`row_${index}`]: true });
    setAnchorElItemPop({ [`row_${index}`]: event.currentTarget });
  };

  const handleTableActionClose = (e, index) => {
    setIsClickTableAction({ [`row_${index}`]: false });
  };

  const listenPolicyStatus = (e) => {};

  const [isClickApprovePolicy, setIsClickApprovePolicy] = React.useState({});
  const handleApprovePolicy = (e, obj, index) => {
    setIsClickApprovePolicy(true);
    setIsClickTableAction({}); // closing open poppers
    setIsClickApprovePolicy({}); // closing open Models
    setIsClickApprovePolicy({ [`row_${index}`]: true });
  };
  const closePolicyModal = (e) => {
    setIsClickApprovePolicy({});
  };

  const handleEditPolicy = (e, obj, index) => {
    let toLowerCasePolicyId = `${obj.policyNumber}`.toLowerCase();
    history.push({
      pathname: `edit-policy/${toLowerCasePolicyId}`,
      state: { currentObj: obj },
    });
  };

  useEffect(() => {
    if (!!props.flexTableArray) {
      setPoliciesData(props.flexTableArray);
    }
  });

  const changePolicyStatus = (e, obj, index) => {
    let putData = {
      uuid: obj.uuid,
      status: 'approved',
    };

    ApiService.put(`${EMP_CONST.URL.exe_policiesList}`, putData)
      .then((response) => {
        // console.log('response getTpasList ', response);
        if (typeof response !== 'undefined' && !!response.data) {
          if (
            !!Array.isArray(response.data) &&
            Object.keys(response.data).length > 0
          ) {
            setPoliciesData([
              ...policiesData,
              (policiesData[index].status = 'approved'),
            ]);
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
        setIsClickApprovePolicy(false);
      });
  };

  const tableActionTemplate = (obj, i) => {
    let policyId = obj.policyNumber;
    let headings = { ...props.data, id: obj.policyNumber };
    return (
      <Fragment>
        <MenuItem>
          <Link
            to={{
              pathname: `${props.data.detailsPath}/${policyId}`,
              state: {
                headings: headings,
                tableData: obj,
              },
            }}
          >
            <FontAwesomeIcon icon="eye" className="mr-2" /> View details
          </Link>
        </MenuItem>
        {obj.status === 'created' && currentUser.role === 'executive' ? (
          <MenuItem>
            <a onClick={(e) => handleEditPolicy(e, obj, i)}>
              <FontAwesomeIcon icon="edit" className="mr-2" /> Edit Policy
            </a>
          </MenuItem>
        ) : currentUser.role === 'manager' ? (
          <MenuItem>
            <a onClick={(e) => handleEditPolicy(e, obj, i)}>
              <FontAwesomeIcon icon="edit" className="mr-2" /> Edit Policy
            </a>
          </MenuItem>
        ) : null}
        {obj.status === 'created' && currentUser.role === 'manager' ? (
          <MenuItem>
            <a onClick={(e) => handleApprovePolicy(e, obj, i)}>
              <FontAwesomeIcon icon="pencil-alt" className="mr-2" /> Approve
              Policy
            </a>
          </MenuItem>
        ) : null}
      </Fragment>
    );
  };

  const currentStatusCheck = (status) => {
    let statusChangeToLowerCase = `${status}`.toLowerCase();
    switch (statusChangeToLowerCase) {
      case 'created':
        return <span className="table-status __created">Created</span>;
      case 'approved':
        return <span className="table-status __active">Approved</span>;
      default:
        break;
    }
  };

  const policiesListTemplate = (
    <Fragment>
      <div class="hpr-flex-table hpr-flex-table--collapse">
        <div class="hpr-flex-table-row hpr-flex-table-row--head">
          <div
            style={{ width: '20%' }}
            class="hpr-flex-table-cell hpr-flex-table-column-heading"
          >
            Policy Number
          </div>
          <div
            style={{ width: '19%' }}
            class="hpr-flex-table-cell hpr-flex-table-column-heading"
          >
            Corporate
          </div>
          <div
            style={{ width: '12%' }}
            class="hpr-flex-table-cell hpr-flex-table-column-heading"
          >
            Policy Year
          </div>

          <div
            style={{ width: '12%' }}
            class="hpr-flex-table-cell hpr-flex-table-column-heading"
          >
            Start Date
          </div>
          <div
            style={{ width: '15%' }}
            class="hpr-flex-table-cell hpr-flex-table-column-heading"
          >
            Sum Insured
          </div>

          <div
            style={{ width: '12%' }}
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

        {policiesData.length == 0 && <NoRecords></NoRecords>}

        {policiesData.length > 0 &&
          policiesData.map((val, index) => (
            <div class="hpr-flex-table-row">
              {/* <pre>{JSON.stringify(val[0])}</pre> */}
              <div
                style={{ width: '20%' }}
                class="hpr-flex-table-cell hpr-flex-table-topic-cell"
              >
                <div class="hpr-flex-table-cell--content date-content">
                  <span class="webinar-date">{val.policyNumber}</span>
                </div>
              </div>
              <div style={{ width: '19%' }} class="hpr-flex-table-cell">
                <div class="hpr-flex-table-cell--heading">Corporate</div>
                <div class="hpr-flex-table-cell--content title-content">
                  {val.companyName}
                </div>
              </div>
              <div style={{ width: '12%' }} class="hpr-flex-table-cell">
                <div class="hpr-flex-table-cell--heading">Policy Year</div>
                <div class="hpr-flex-table-cell--content title-content">
                  {val.policyYear}
                </div>
              </div>

              <div style={{ width: '12%' }} class="hpr-flex-table-cell">
                <div class="hpr-flex-table-cell--heading"> Start Date</div>
                <div class="hpr-flex-table-cell--content access-link-content">
                  <Moment format="DD/MM/YYYY">{`${val.fromDate}`}</Moment>
                </div>
              </div>

              <div style={{ width: '15%' }} class="hpr-flex-table-cell">
                <div class="hpr-flex-table-cell--heading"> Sum Insured</div>
                <div class="hpr-flex-table-cell--content replay-link-content">
                  {val.sumInsured}
                </div>
              </div>

              <div style={{ width: '12%' }} class="hpr-flex-table-cell">
                <div class="hpr-flex-table-cell--heading"> Status</div>
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

                {!!isClickApprovePolicy[`row_${index}`] && (
                  <ModalWindow
                    dataModel={{
                      title: 'Change status of current policy',
                      description: `<span class='modal-description'>Do you need update the status to " <b>${CapitalizeFirstLetter(
                        'Approve'
                      )}</b>" ?</span>`,
                      primaryBtnTxt: 'Yes',
                      secondaryBtnTxt: 'No',
                    }}
                    closeModal={closePolicyModal}
                    submitModal={(e) => changePolicyStatus(e, val, index)}
                    modalOpen={isClickApprovePolicy[`row_${index}`]}
                    handleResponse={listenPolicyStatus}
                  />
                )}
              </div>
            </div>
          ))}
      </div>
    </Fragment>
  );

  return policiesListTemplate;
});

export default PoliciesList;
