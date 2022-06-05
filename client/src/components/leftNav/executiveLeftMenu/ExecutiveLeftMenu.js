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

const ExecutiveLeftMenu = React.memo((props) => {
  // console.log(
  //   'ExecutiveLeftMenu props stringCheckLocationHref employees ',
  //   stringCheckLocationHref('employees')
  // );

  let currentRolePath = '/executive-home';

  const executiveLeftMenuTemplate = (
    <Fragment>
      {props.currentUser.role === 'manager' && (
        <li
          className={`main-menu-list ${
            stringCheckLocationHref('mis') ? 'mm-active' : ''
          }`}
        >
          <Link to="/#" onClick={mainLeftNavHead}>
            <FontAwesomeIcon icon="chart-bar" />
            <span>MIS</span>
            <FontAwesomeIcon
              icon="chevron-down"
              className="collapse-expand-icon"
            />
          </Link>
          <ul className="sub-menu mm-collapse" aria-expanded="false">
            {EMP_CONST.EXECUTIVE_MIS_SUB_MENU.map((val) => (
              <li>
                <Link
                  className={`sub-menu-list-link ${
                    stringCheckLocationHref(val.link)
                      ? 'hpr-sub-menu-active'
                      : ''
                  }`}
                  to={{
                    pathname: `${currentRolePath}/mis/${val.link}`,
                  }}
                  onClick={subLeftNavHead}
                >
                  {val.name}
                </Link>
              </li>
            ))}
          </ul>
        </li>
      )}

      {props.currentUser.role === 'manager' && (
        <li
          className={`main-menu-list ${
            stringCheckLocationHref('executives') ? 'mm-active' : ''
          }`}
        >
          <Link to="/#" onClick={mainLeftNavHead}>
            <FontAwesomeIcon icon="list-alt" />
            <span>Executives</span>
            <FontAwesomeIcon
              icon="chevron-down"
              className="collapse-expand-icon"
            />
          </Link>
          <ul className="sub-menu mm-collapse" aria-expanded="false">
            {EMP_CONST.EXECUTIVE_EXECUTIVES_SUB_MENU.map((val) => (
              <li>
                <Link
                  className={`sub-menu-list-link ${
                    stringCheckLocationHref(val.link)
                      ? 'hpr-sub-menu-active'
                      : ''
                  }`}
                  to={{
                    pathname: `${currentRolePath}/executives/${val.link}`,
                  }}
                  onClick={subLeftNavHead}
                >
                  {val.name}
                </Link>
              </li>
            ))}
          </ul>
        </li>
      )}
      <li
        className={`main-menu-list ${
          stringCheckLocationHref('corporates') ? 'mm-active' : ''
        }`}
      >
        <Link to="/#" onClick={mainLeftNavHead}>
          <FontAwesomeIcon icon="users" />
          <span>Corporates</span>
          <FontAwesomeIcon
            icon="chevron-down"
            className="collapse-expand-icon"
          />
        </Link>
        <ul className="sub-menu mm-collapse" aria-expanded="false">
          {props.currentUser.role === 'manager' ? (
            <li>
              <Link
                className={`sub-menu-list-link ${
                  stringCheckLocationHref(
                    EMP_CONST.EXECUTIVE_CORPORATES_SUB_MENU[0].link
                  )
                    ? 'hpr-sub-menu-active'
                    : ''
                }`}
                to={{
                  pathname: `${currentRolePath}/corporates/${EMP_CONST.EXECUTIVE_CORPORATES_SUB_MENU[0].link}`,
                }}
                onClick={subLeftNavHead}
              >
                {EMP_CONST.EXECUTIVE_CORPORATES_SUB_MENU[0].name}
              </Link>
            </li>
          ) : (
            EMP_CONST.EXECUTIVE_CORPORATES_SUB_MENU.map((val) => (
              <li>
                <Link
                  className={`sub-menu-list-link ${
                    stringCheckLocationHref(val.link)
                      ? 'hpr-sub-menu-active'
                      : ''
                  }`}
                  to={{
                    pathname: `${currentRolePath}/corporates/${val.link}`,
                  }}
                  onClick={subLeftNavHead}
                >
                  {val.name}
                </Link>
              </li>
            ))
          )}
        </ul>
      </li>

      <li
        className={`main-menu-list ${
          stringCheckLocationHref('policies') ? 'mm-active' : ''
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
          {EMP_CONST.EXECUTIVE_POLICIES_SUB_MENU.map((val) => (
            <li>
              <Link
                className={`sub-menu-list-link ${
                  stringCheckLocationHref(val.link) ? 'hpr-sub-menu-active' : ''
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
          stringCheckLocationHref('employees') ? 'mm-active' : ''
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
          {EMP_CONST.EXECUTIVE_EMPLOYEES_SUB_MENU.map((val) => (
            <li>
              <Link
                className={`sub-menu-list-link ${
                  stringCheckLocationHref(val.link) ? 'hpr-sub-menu-active' : ''
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
          stringCheckLocationHref('claims') ? 'mm-active' : ''
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
          {EMP_CONST.EXECUTIVE_CLAIMS_SUB_MENU.map((val) => (
            <li>
              <Link
                className={`sub-menu-list-link ${
                  stringCheckLocationHref(val.link) ? 'hpr-sub-menu-active' : ''
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
          stringCheckLocationHref('hospitals') ? 'mm-active' : ''
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
          {EMP_CONST.EXECUTIVE_HOSPITALS_SUB_MENU.map((val) => (
            <li>
              <Link
                className={`sub-menu-list-link ${
                  stringCheckLocationHref(val.link) ? 'hpr-sub-menu-active' : ''
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
          stringCheckLocationHref('services') ? 'mm-active' : ''
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
          {EMP_CONST.EXECUTIVE_SERVICES_SUB_MENU.map((val) => (
            <li>
              <Link
                className={`sub-menu-list-link ${
                  stringCheckLocationHref(val.link) ? 'hpr-sub-menu-active' : ''
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

  return executiveLeftMenuTemplate;
});

export default ExecutiveLeftMenu;
