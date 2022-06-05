import React, { Fragment, useContext, useState, useEffect } from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { EMP_CONST } from '../../../services/Constants';

import {
  BrowserRouter as Router,
  Route,
  Redirect,
  Switch,
  Link,
  useHistory,
} from 'react-router-dom';

import {
  stringCheckLocationHref,
  mainLeftNavHead,
  subLeftNavHead,
} from '../../../reUseComponents/utils/utils';

const CustomerLeftMenu = React.memo((props) => {
  // console.log('CustomerLeftMenu props ', props);
  let currentRolePath = '/customer-home';

  const customerLeftMenuTemplate = (
    <Fragment>
      <li
        className={`main-menu-list ${
          stringCheckLocationHref('policies') ? 'mm-active' : null
        }`}
      >
        <Link to="/#" onClick={mainLeftNavHead}>
          <FontAwesomeIcon icon="users" />
          <span>Policies</span>
          <FontAwesomeIcon
            icon="chevron-down"
            className="collapse-expand-icon"
          />
        </Link>
        <ul className="sub-menu mm-collapse" aria-expanded="false">
          {EMP_CONST.CUST_POLICIES_SUB_MENU.map((val) => (
            <li>
              <Link
                className={`sub-menu-list-link ${
                  stringCheckLocationHref(val.link)
                    ? 'hpr-sub-menu-active'
                    : null
                }`}
                to={{
                  pathname: `${currentRolePath}/policies/${val.link}`,
                }}
                onClick={subLeftNavHead}
              >
                {val.name}
              </Link>
            </li>
          ))}
        </ul>
      </li>

      <li
        className={`main-menu-list ${
          stringCheckLocationHref('hospitals') ? 'mm-active' : null
        }`}
      >
        <Link to="/#" onClick={mainLeftNavHead}>
          <FontAwesomeIcon icon="hospital" />
          <span>Hospitals</span>
          <FontAwesomeIcon
            icon="chevron-down"
            className="collapse-expand-icon"
          />
        </Link>
        <ul className="sub-menu mm-collapse" aria-expanded="false">
          {EMP_CONST.CUST_HOSPITALS_SUB_MENU.map((val) => (
            <li>
              <Link
                className={`sub-menu-list-link ${
                  stringCheckLocationHref(val.link)
                    ? 'hpr-sub-menu-active'
                    : null
                }`}
                to={{
                  pathname: `${currentRolePath}/hospitals/${val.link}`,
                }}
                onClick={subLeftNavHead}
              >
                {val.name}
              </Link>
            </li>
          ))}
        </ul>
      </li>

      <li
        className={`main-menu-list ${
          stringCheckLocationHref('claims') ? 'mm-active' : null
        }`}
      >
        <Link to="/#" onClick={mainLeftNavHead}>
          <FontAwesomeIcon icon="notes-medical" />
          <span>Claims</span>
          <FontAwesomeIcon
            icon="chevron-down"
            className="collapse-expand-icon"
          />
        </Link>
        <ul className="sub-menu mm-collapse" aria-expanded="false">
          {EMP_CONST.CUST_CLAIMS_SUB_MENU.map((val) => (
            <li>
              <Link
                className={`sub-menu-list-link ${
                  stringCheckLocationHref(val.link)
                    ? 'hpr-sub-menu-active'
                    : null
                }`}
                to={{
                  pathname: `${currentRolePath}/claims/${val.link}`,
                }}
                onClick={subLeftNavHead}
              >
                {val.name}
              </Link>
            </li>
          ))}
        </ul>
      </li>
      <li
        className={`main-menu-list ${
          stringCheckLocationHref('services') ? 'mm-active' : null
        }`}
      >
        <Link to="/#" onClick={mainLeftNavHead}>
          <FontAwesomeIcon icon="cogs" />
          <span>Services</span>
          <FontAwesomeIcon
            icon="chevron-down"
            className="collapse-expand-icon"
          />
        </Link>
        <ul className="sub-menu mm-collapse" aria-expanded="false">
          {EMP_CONST.CUST_SERVICES_SUB_MENU.map((val) => (
            <li>
              <Link
                className={`sub-menu-list-link ${
                  stringCheckLocationHref(val.link)
                    ? 'hpr-sub-menu-active'
                    : null
                }`}
                to={{
                  pathname: `${currentRolePath}/services/${val.link}`,
                }}
                onClick={subLeftNavHead}
              >
                {val.name}
              </Link>
            </li>
          ))}
        </ul>
      </li>
    </Fragment>
  );

  return customerLeftMenuTemplate;
});

export default CustomerLeftMenu;
