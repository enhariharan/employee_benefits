import React, { Fragment, useContext, useEffect, useState } from 'react';
// import MetisMenu from 'metismenujs';

import './leftMenu.scss';
import SimpleBar from 'simplebar-react';

import HrLeftMenu from './hrLeftMenu/HrLeftMenu';
import ExecutiveLeftMenu from './executiveLeftMenu/ExecutiveLeftMenu';
import CustomerLeftMenu from './customerLeftMenu/CustomerLeftMenu';

import {
  BrowserRouter as Router,
  Route,
  Redirect,
  Switch,
  Link,
  useHistory,
} from 'react-router-dom';

import { AuthContext } from '../../context/AuthContext';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const LeftMenu = React.memo((props) => {
  // console.log('LeftMenu props ', props);
  const history = useHistory();

  const [currentUser] = useContext(AuthContext);
  if (!currentUser) {
    history.push('/login');
  }

  const SidebarContent = () => {
    let currentRole = currentUser.role;
    return (
      <div id="sidebar-menu">
        <ul className="metismenu list-unstyled" id="side-menu">
          <li>
            <Link
              to={
                currentRole === 'executive' || currentUser.role === 'manager'
                  ? '/executive-home'
                  : currentRole === 'hr'
                  ? '/hr-home'
                  : '/customer-home'
              }
              className=""
            >
              <FontAwesomeIcon icon="home" />
              <span>Home </span>
            </Link>
          </li>

          {(currentUser.role === 'executive' ||
            currentUser.role === 'manager') && (
            <ExecutiveLeftMenu currentUser={currentUser} />
          )}
          {currentUser.role === 'hr' && <HrLeftMenu />}

          {currentUser.role === 'customer' && <CustomerLeftMenu />}
        </ul>
      </div>
    );
  };

  const leftMenuTemplate = !!currentUser && (
    <Fragment>
      <div className="vertical-menu">
        <div data-simplebar className="h-100">
          <SimpleBar style={{ maxHeight: '100%' }}>
            <SidebarContent />
          </SimpleBar>
        </div>
      </div>
    </Fragment>
  );
  return leftMenuTemplate;
});

export default LeftMenu;
