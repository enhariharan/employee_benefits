import React, { Fragment, useContext, useState, useEffect } from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './claimStatus.scss';

import MenuItem from '@material-ui/core/MenuItem';

import { Link } from 'react-router-dom';

import PopperMenu from '../../../reUseComponents/popperMenu/PopperMenu.jsx';
import NoRecords from '../../../reUseComponents/noRecords/NoRecords';

const ClaimStatus = React.memo((props) => {
  // console.log('ClaimStatus props ', props);

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
    // console.log('obj ', obj);
    let claimId = obj.claimId;
    let headings = { ...props.data, id: obj.claimId };
    return (
      <Fragment>
        <MenuItem>
          <Link
            to={{
              pathname: `${props.data.detailsPath}/${claimId}`,
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

  const claimStatusTemplate = (
    <Fragment>
      <div class="hpr-flex-table hpr-flex-table--collapse">
        <div class="hpr-flex-table-row hpr-flex-table-row--head">
          <div
            style={{ width: '10%' }}
            class="hpr-flex-table-cell hpr-flex-table-column-heading"
          >
            Claim Id
          </div>

          <div
            style={{ width: '15%' }}
            class="hpr-flex-table-cell hpr-flex-table-column-heading"
          >
            Employee Id
          </div>

          <div
            style={{ width: '20%' }}
            class="hpr-flex-table-cell hpr-flex-table-column-heading"
          >
            Employee Name
          </div>

          <div
            style={{ width: '20%' }}
            class="hpr-flex-table-cell hpr-flex-table-column-heading"
          >
            Initial Estimate
          </div>
          <div
            style={{ width: '15%' }}
            class="hpr-flex-table-cell hpr-flex-table-column-heading"
          >
            Amount Approved
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
                style={{ width: '10%' }}
                class="hpr-flex-table-cell hpr-flex-table-topic-cell"
              >
                <div class="hpr-flex-table-cell--content date-content">
                  <span class="webinar-date">{val.claimId}</span>
                </div>
              </div>

              <div style={{ width: '15%' }} class="hpr-flex-table-cell">
                <div class="hpr-flex-table-cell--heading">Employee Id</div>
                <div class="hpr-flex-table-cell--content title-content">
                  {val.empid}
                </div>
              </div>

              <div style={{ width: '20%' }} class="hpr-flex-table-cell">
                <div class="hpr-flex-table-cell--heading">Employee Name</div>
                <div class="hpr-flex-table-cell--content title-content">
                  {val.employeeName}
                </div>
              </div>

              <div style={{ width: '20%' }} class="hpr-flex-table-cell">
                <div class="hpr-flex-table-cell--heading">Initial Estimate</div>
                <div class="hpr-flex-table-cell--content access-link-content">
                  {val.initialEstimate}
                </div>
              </div>
              <div style={{ width: '15%' }} class="hpr-flex-table-cell">
                <div class="hpr-flex-table-cell--heading">Amount Approved</div>
                <div class="hpr-flex-table-cell--content replay-link-content">
                  {val.amountApproved}
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
              </div>
            </div>
          ))}
      </div>
    </Fragment>
  );

  return claimStatusTemplate;
});

export default ClaimStatus;
