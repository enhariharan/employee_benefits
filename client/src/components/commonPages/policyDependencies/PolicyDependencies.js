import React, { Fragment, useContext, useState, useEffect } from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './policyDependencies.scss';

import MenuItem from '@material-ui/core/MenuItem';

import Moment from 'react-moment';

import PopperMenu from '../../../reUseComponents/popperMenu/PopperMenu.jsx';
import NoRecords from '../../../reUseComponents/noRecords/NoRecords';

import {
  BrowserRouter as Router,
  Route,
  Redirect,
  Switch,
  Link,
  useHistory,
} from 'react-router-dom';

const PolicyDependencies = React.memo((props) => {
  // console.log('PolicyDependencies props ', props);

  const [isClickTableAction, setIsClickTableAction] = React.useState({});
  const [anchorElItemPop, setAnchorElItemPop] = React.useState({});

  const handleClickTableAction = (event, index) => {
    setIsClickTableAction({ [`row_${index}`]: true });
    setAnchorElItemPop({ [`row_${index}`]: event.currentTarget });
  };

  const handleTableActionClose = (e, index) => {
    setIsClickTableAction({ [`row_${index}`]: false });
  };

  const tableActionTemplate = (obj, i) => {
    let headings = {
      ...props.data,
      id: obj.firstName + obj.lastName,
    };
    return (
      <Fragment>
        <MenuItem>
          <Link
            to={{
              pathname: `${props.data.detailsPath}/${
                obj.firstName + obj.lastName
              }`,
              state: { headings: headings, tableData: obj },
            }}
          >
            <FontAwesomeIcon icon="eye" className="mr-2" /> View details
          </Link>
        </MenuItem>
      </Fragment>
    );
  };

  useEffect(() => {}, []);

  const policyDependenciesTemplate = (
    <Fragment>
      <div class="hpr-flex-table hpr-flex-table--collapse">
        <div class="hpr-flex-table-row hpr-flex-table-row--head">
          <div
            style={{ width: '20%' }}
            class="hpr-flex-table-cell hpr-flex-table-column-heading"
          >
            Full Name
          </div>
          <div
            style={{ width: '20%' }}
            class="hpr-flex-table-cell hpr-flex-table-column-heading"
          >
            Relationship
          </div>
          <div
            style={{ width: '20%' }}
            class="hpr-flex-table-cell hpr-flex-table-column-heading"
          >
            DOB
          </div>
          <div
            style={{ width: '15%' }}
            class="hpr-flex-table-cell hpr-flex-table-column-heading"
          >
            Created Date
          </div>

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
                style={{ width: '20%' }}
                class="hpr-flex-table-cell hpr-flex-table-topic-cell"
              >
                <div class="hpr-flex-table-cell--content date-content">
                  <span class="webinar-date">
                    {val.firstName} {val.lastName}
                  </span>
                </div>
              </div>
              <div style={{ width: '20%' }} class="hpr-flex-table-cell">
                <div class="hpr-flex-table-cell--heading">Relationship</div>
                <div class="hpr-flex-table-cell--content title-content">
                  {val.relationship}
                </div>
              </div>
              <div style={{ width: '20%' }} class="hpr-flex-table-cell">
                <div class="hpr-flex-table-cell--heading">DOB</div>
                <div class="hpr-flex-table-cell--content access-link-content">
                  <Moment format="MM/DD/YYYY">{`${val.dob}`}</Moment>
                </div>
              </div>
              <div style={{ width: '15%' }} class="hpr-flex-table-cell">
                <div class="hpr-flex-table-cell--heading">Created Date</div>
                <div class="hpr-flex-table-cell--content replay-link-content">
                  <Moment format="MM/DD/YYYY">{`${val.createdAt}`}</Moment>
                </div>
              </div>

              <div style={{ width: '15%' }} class="hpr-flex-table-cell">
                <div class="hpr-flex-table-cell--heading">Status</div>
                <div class="hpr-flex-table-cell--content replay-link-content">
                  {val.status}
                </div>
              </div>

              <div style={{ width: '10%' }} class="hpr-flex-table-cell">
                <div class="hpr-flex-table-cell--heading">Action</div>
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
              </div>
            </div>
          ))}
      </div>
    </Fragment>
  );

  return policyDependenciesTemplate;
});

export default PolicyDependencies;
