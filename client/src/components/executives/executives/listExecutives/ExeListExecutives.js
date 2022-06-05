import React, { Fragment, useContext, useState, useEffect } from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './exeListExecutives.scss';
import {
  BrowserRouter as Router,
  Route,
  Redirect,
  Switch,
  Link,
  useHistory,
} from 'react-router-dom';

import MenuItem from '@material-ui/core/MenuItem';

import { PubSub } from '../../../../services/PubSub';
import ApiService from '../../../../services/ApiService';
import { EMP_CONST } from '../../../../services/Constants';
import { AuthContext } from '../../../../context/AuthContext';

import PopperMenu from '../../../../reUseComponents/popperMenu/PopperMenu.jsx';

import Moment from 'react-moment';

const ExeListExecutives = React.memo((props) => {
  // console.log('ExeListCorporates props ', props);
  const [currentUser] = useContext(AuthContext);
  const [isMobile, setIsMobile] = useState(null);
  const [executivesData, setExecutivesData] = useState([]);

  const history = useHistory();

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
    console.log('obj tableActionTemplate ', obj);
    let executiveName = obj.empid;
    let headings = {
      pageHeading: 'View Details',
      detailsPath: '/executive-home/executives/list-executives',
      id: obj.empid,
    };
    return (
      <Fragment>
        <MenuItem>
          <Link
            to={{
              pathname: `${props.location.pathname}/${executiveName}`,
              state: { headings: headings, tableData: obj },
            }}
          >
            <FontAwesomeIcon icon="eye" className="mr-2" /> View details
          </Link>
        </MenuItem>
      </Fragment>
    );
  };

  useEffect(() => {
    getListExecutives();
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
        // console.log('response getListExecutives ', response);
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

  const exeListExecutivesTemplate = (
    <Fragment>
      <div className="hpr_pageHeadingWrapper">
        <div className="hpr_page-heading-left-wrapper">
          {!!isMobile && (
            <div className="hpr-breadcrumb-wrapper">
              <Link to={'/executive-home/executives'}>
                <FontAwesomeIcon icon="chevron-left" className="mr-1" />
                Back
              </Link>
            </div>
          )}
          <h3 className="">List Executives</h3>
        </div>
      </div>

      <div className="row">
        <div className="col-12">
          <div class="hpr-flex-table hpr-flex-table--collapse">
            <div class="hpr-flex-table-row hpr-flex-table-row--head">
              <div
                style={{ width: '15%' }}
                class="hpr-flex-table-cell hpr-flex-table-column-heading"
              >
                Executive Id
              </div>
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
                Email Id
              </div>
              <div
                style={{ width: '15%' }}
                class="hpr-flex-table-cell hpr-flex-table-column-heading"
              >
                Designation
              </div>

              <div
                style={{ width: '20%' }}
                class="hpr-flex-table-cell hpr-flex-table-column-heading"
              >
                Mobile
              </div>

              <div
                style={{ width: '10%' }}
                class="hpr-flex-table-cell hpr-flex-table-column-heading"
              >
                Actions
              </div>
            </div>

            {!!executivesData &&
              executivesData.length > 0 &&
              executivesData.map((val, index) => (
                <div class="hpr-flex-table-row">
                  <div
                    style={{ width: '15%' }}
                    class="hpr-flex-table-cell hpr-flex-table-topic-cell"
                  >
                    <div class="hpr-flex-table-cell--content date-content">
                      <span class="webinar-date">{val.empid}</span>
                    </div>
                  </div>

                  <div style={{ width: '20%' }} class="hpr-flex-table-cell">
                    <div class="hpr-flex-table-cell--heading">First Name</div>
                    <div class="hpr-flex-table-cell--content access-link-content">
                      {val.firstName} {val.lastName}
                    </div>
                  </div>
                  <div style={{ width: '20%' }} class="hpr-flex-table-cell">
                    <div class="hpr-flex-table-cell--heading">Email</div>
                    <div class="hpr-flex-table-cell--content replay-link-content">
                      {val.email}
                    </div>
                  </div>

                  <div style={{ width: '15%' }} class="hpr-flex-table-cell">
                    <div class="hpr-flex-table-cell--heading">Designation</div>
                    <div class="hpr-flex-table-cell--content replay-link-content">
                      {val.designation}
                    </div>
                  </div>
                  <div style={{ width: '20%' }} class="hpr-flex-table-cell">
                    <div class="hpr-flex-table-cell--heading">Mobile</div>
                    <div class="hpr-flex-table-cell--content replay-link-content">
                      {val.mobile}
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
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </Fragment>
  );

  return exeListExecutivesTemplate;
});

export default ExeListExecutives;
