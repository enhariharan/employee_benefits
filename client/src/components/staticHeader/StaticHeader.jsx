import React, { Fragment, useContext, useState, useEffect } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Redirect,
  Switch,
  Link,
  useHistory,
} from 'react-router-dom';

import update from 'immutability-helper';

import { AuthContext } from '../../context/AuthContext';
import { PubSub } from '../../services/PubSub';
import ApiService from '../../services/ApiService';
import { EMP_CONST } from '../../services/Constants';
import { GlobalDataContext } from '../../context/GlobalDataContext';

// import images
import logosmImg from '../../assets/images/visista-logo-2.png';
import profileImg from '../../assets/images/profile3.jpg';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import PopperMenu from '../../reUseComponents/popperMenu/PopperMenu.jsx';

import MenuItem from '@material-ui/core/MenuItem';
import Divider from '@material-ui/core/Divider';

import './staticHeader.scss';

const StaticHeader = React.memo((props) => {
  const staticHeaderTemplate = (
    <Fragment>
      <header id="page-header">
        <div className="navbar-header">
          <div className="d-flex">
            <div className="navbar-brand-box">
              <Link className="logo logo-dark">
                <span className="logo-sm">
                  <img src={logosmImg} alt="" />
                </span>
              </Link>
            </div>

            {/* <button
              type="button"
              onClick={this.toggleMenu}
              className="btn btn-sm px-3 font-size-24 header-item waves-effect"
              id="vertical-menu-btn"
            >
              <i className="mdi mdi-menu"></i>
            </button> */}
          </div>
        </div>
      </header>
    </Fragment>
  );

  return staticHeaderTemplate;
});

export default StaticHeader;
