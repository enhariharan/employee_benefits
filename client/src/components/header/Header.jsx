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

import './header.scss';

const Header = React.memo((props) => {
  const history = useHistory();
  const [globalOnLoadData, setGlobalOnLoadData] = useContext(GlobalDataContext);
  const [currentUser, setCurrentUser, handleLogin, handleLogout] = useContext(
    AuthContext
  );
  const [isMobile, setIsMobile] = useState(false);
  // console.log('currentUser Header ', currentUser);
  if (!currentUser) {
    history.push('/login');
  }

  // console.log('globalOnLoadData ', globalOnLoadData);

  useEffect(() => {
    if (
      !!currentUser &&
      (currentUser.role === 'hr' ||
        currentUser.role === 'executive' ||
        currentUser.role === 'manager')
    ) {
      getNotifactionCount();
    }

    PubSub.subscribe(PubSub.events.IS_MOBILE, (flag) => {
      setIsMobile(flag);
    });
    return () => {
      PubSub.unsubscribe(PubSub.events.IS_MOBILE);
    };
  }, []);

  const [isUserPicClick, setIsUserPicClick] = useState(false);
  const [anchorElItemPop, setAnchorElItemPop] = useState(null);

  const userPicClick = (e) => {
    setIsUserPicClick(!isUserPicClick);
    setAnchorElItemPop(e.currentTarget);
  };

  const closeuserPicClick = (e) => {
    setIsUserPicClick(false);
  };
  const logoutHandClick = (e) => {
    // console.log('logoutHandClick ', e);
    handleLogout();
    history.push('/login');
  };

  const getNotifactionCount = () => {
    ApiService.get(`${EMP_CONST.URL.get_pending_action_notifications}`)
      .then((response) => {
        // console.log('response getNotifactionCount ', response);
        if (
          typeof response !== 'undefined' &&
          !!response.data &&
          Object.keys(response.data).length > 0
        ) {
          let notifyNum = Object.values(response.data).reduce(
            (a, b) => a + b,
            0
          );

          const pendingActionsData = update(globalOnLoadData, {
            ['pendingActionsData']: {
              $set: response.data,
            },
            ['notificationCount']: {
              $set: notifyNum,
            },
          });
          setGlobalOnLoadData(pendingActionsData);
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

  const userPicTemplate = (
    <Fragment>
      <MenuItem>
        <a onClick="">Profile</a>
      </MenuItem>
      <MenuItem>
        <a onClick="">Settings</a>
      </MenuItem>
      <Divider />
      <MenuItem>
        <a onClick={logoutHandClick} className="removeListItem">
          Log out
        </a>
      </MenuItem>
    </Fragment>
  );

  const headerTemplate = !!currentUser && (
    <Fragment>
      <header id="page-header">
        <div className="navbar-header">
          <div className="d-flex">
            <div className="navbar-brand-box">
              <Link
                to={
                  !!currentUser
                    ? currentUser['role'].toLowerCase() === 'hr'
                      ? '/hr-home'
                      : currentUser['role'].toLowerCase() === 'executive' ||
                        currentUser['role'].toLowerCase() === 'manager'
                      ? '/executive-home'
                      : '/customer-home'
                    : '/'
                }
                className="logo logo-dark"
              >
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

          {/* Header right wrapper */}
          <div className="d-flex">
            {!!currentUser &&
              (currentUser.role === 'hr' ||
                currentUser.role === 'executive' ||
                currentUser.role === 'manager') && (
                <div className="hpr_headerNotiWrapper align-self-center">
                  <Link
                    to={props.notifyRedirectUrl}
                    className="hpr_headerNotiNum"
                  >
                    {globalOnLoadData.notificationCount}
                  </Link>

                  <FontAwesomeIcon icon="bell" />
                </div>
              )}

            <div className="hpr_headeUserWrapper" onClick={userPicClick}>
              <div className="hpr_headeUserImg">
                <img src={profileImg} />
              </div>
              <span className="align-self-center">
                {currentUser['username']}
                <FontAwesomeIcon icon="angle-down" />
              </span>
            </div>

            {!!isUserPicClick && (
              <PopperMenu
                currentIndex="0"
                isOpenPop={isUserPicClick}
                anchorRef={anchorElItemPop}
                poppoverClick={closeuserPicClick}
                menuListTemp={userPicTemplate}
                placement="bottom-end"
                minWidth="150px"
              />
            )}
          </div>
        </div>
      </header>
    </Fragment>
  );

  return headerTemplate;
});

export default Header;
