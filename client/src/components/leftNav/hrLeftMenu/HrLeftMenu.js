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

const HrLeftMenu = React.memo((props) => {
  // console.log('HrLeftMenu props ', props);
  // console.log(
  //   'HrLeftMenu window.location.href ',
  //   stringCheckLocationHref('policies')
  // );
  let currentRolePath = '/hr-home';

  const hrLeftMenuTemplate = (
    <Fragment>
      <li
        className={`main-menu-list ${
          stringCheckLocationHref('employees') ? 'mm-active' : null
        }`}
      >
        <Link to="/#" onClick={mainLeftNavHead}>
          <FontAwesomeIcon icon="users" />
          <span>Employees</span>
          <FontAwesomeIcon
            icon="chevron-down"
            className="collapse-expand-icon"
          />
        </Link>
        <ul className="sub-menu mm-collapse" aria-expanded="false">
          {EMP_CONST.HR_EMPLOYEES_SUB_MENU.map((val) => (
            <li>
              <Link
                className={`sub-menu-list-link ${
                  stringCheckLocationHref(val.link)
                    ? 'hpr-sub-menu-active'
                    : null
                }`}
                to={{
                  pathname: `${currentRolePath}/employees/${val.link}`,
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
          {EMP_CONST.HR_HOSPITALS_SUB_MENU.map((val) => (
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
          {EMP_CONST.HR_CLAIMS_SUB_MENU.map((val) => (
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
          stringCheckLocationHref('policies') ? 'mm-active' : null
        }`}
      >
        <Link to="/#" onClick={mainLeftNavHead}>
          <FontAwesomeIcon icon="list-alt" />
          <span>Policies</span>
          <FontAwesomeIcon
            icon="chevron-down"
            className="collapse-expand-icon"
          />
        </Link>
        <ul className="sub-menu mm-collapse" aria-expanded="false">
          {EMP_CONST.HR_POLICIES_SUB_MENU.map((val) => (
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
    </Fragment>
  );

  return hrLeftMenuTemplate;
});

export default HrLeftMenu;
