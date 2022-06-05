import React, { Fragment, useContext, useState, useEffect } from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './networkHospitals.scss';

import MenuItem from '@material-ui/core/MenuItem';

import { Link } from 'react-router-dom';

import PopperMenu from '../../../reUseComponents/popperMenu/PopperMenu.jsx';
import NoRecords from '../../../reUseComponents/noRecords/NoRecords';

const NetworkHospitals = React.memo((props) => {
  // console.log('NetworkHospitals props ', props);

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
    let hospitalId = obj.hospitalId;
    let headings = { ...props.data, id: obj.hospitalId };
    return (
      <Fragment>
        <MenuItem>
          <Link
            to={{
              pathname: `${props.data.detailsPath}/${hospitalId}`,
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

  const networkHospitalsTemplate = (
    <Fragment>
      <div className="hpr-flex-table hpr-flex-table--collapse">
        <div className="hpr-flex-table-row hpr-flex-table-row--head">
          <div
            style={{ width: '5%' }}
            className="hpr-flex-table-cell hpr-flex-table-column-heading"
          >
            ID
          </div>
          <div
            style={{ width: '15%' }}
            className="hpr-flex-table-cell hpr-flex-table-column-heading"
          >
            Hospital Name
          </div>

          <div
            style={{ width: '20%' }}
            className="hpr-flex-table-cell hpr-flex-table-column-heading"
          >
            Building Name
          </div>
          <div
            style={{ width: '20%' }}
            className="hpr-flex-table-cell hpr-flex-table-column-heading"
          >
            Address
          </div>
          <div
            style={{ width: '10%' }}
            className="hpr-flex-table-cell hpr-flex-table-column-heading"
          >
            City
          </div>
          <div
            style={{ width: '12%' }}
            className="hpr-flex-table-cell hpr-flex-table-column-heading"
          >
            Contact
          </div>

          <div
            style={{ width: '8%' }}
            className="hpr-flex-table-cell hpr-flex-table-column-heading"
          >
            Actions
          </div>
        </div>

        {props.hospitalListData.length == 0 && <NoRecords></NoRecords>}

        {props.hospitalListData.length > 0 &&
          props.hospitalListData.map((val, index) => (
            <div className="hpr-flex-table-row">
              <div style={{ width: '5%' }} className="hpr-flex-table-cell">
                <div className="hpr-flex-table-cell--heading">ID</div>
                <div className="hpr-flex-table-cell--content date-content">
                  <span className="webinar-date">{val.hospitalId}</span>
                </div>
              </div>
              <div
                style={{ width: '15%' }}
                className="hpr-flex-table-cell hpr-flex-table-topic-cell"
              >
                <div className="hpr-flex-table-cell--content title-content">
                  {val.name}
                </div>
              </div>
              <div style={{ width: '20%' }} className="hpr-flex-table-cell">
                <div className="hpr-flex-table-cell--heading">
                  Building Name
                </div>
                <div className="hpr-flex-table-cell--content access-link-content">
                  {val.addressBuildingName}
                </div>
              </div>
              <div style={{ width: '20%' }} className="hpr-flex-table-cell">
                <div className="hpr-flex-table-cell--heading">Address</div>
                <div className="hpr-flex-table-cell--content access-link-content">
                  {val.addressBuildingAddress}
                </div>
              </div>
              <div style={{ width: '10%' }} className="hpr-flex-table-cell">
                <div className="hpr-flex-table-cell--heading">City</div>
                <div className="hpr-flex-table-cell--content replay-link-content">
                  {val.addressCity}
                </div>
              </div>

              <div style={{ width: '12%' }} className="hpr-flex-table-cell">
                <div className="hpr-flex-table-cell--heading">Contact</div>
                <div className="hpr-flex-table-cell--content replay-link-content">
                  {val.contactMobile}
                </div>
              </div>

              <div style={{ width: '8%' }} className="hpr-flex-table-cell">
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
              </div>
            </div>
          ))}
      </div>
    </Fragment>
  );

  return networkHospitalsTemplate;
});

export default NetworkHospitals;
