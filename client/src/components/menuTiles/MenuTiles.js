import React, { Fragment, useContext, useState, useEffect } from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import SimpleBarReact from 'simplebar-react';

import './menuTiles.scss';

import { AuthContext } from '../../context/AuthContext';
import { EMP_CONST } from '../../services/Constants';

import {
  BrowserRouter as Router,
  Route,
  Redirect,
  Switch,
  Link,
  useHistory,
} from 'react-router-dom';

const MenuTiles = React.memo((props) => {
  const [currentUser] = useContext(AuthContext);

  // console.log('props  MenuTiles ', props);
  const currentRole = currentUser.role;
  const menuTilesTemplate = (
    <Fragment>
      {props.isMobile !== null && (
        <Fragment>
          {!props.isMobile ? ( // Only For Desktop
            <div className="row hpr_colBoxWrapperHome">
              {currentRole === 'hr' && (
                <Fragment>
                  {EMP_CONST.HR_MENU_LIST.map((val) => (
                    <div className="col equalHCol">
                      <Link
                        className={`hpr_colBoxCatWrapper ${
                          window.location.href.indexOf(
                            val.name.toString().toLowerCase()
                          ) > -1
                            ? 'activeColBox'
                            : ''
                        }`}
                        to={`/${val.link}`}
                      >
                        <div className="row justify-content-center align-items-center h-100">
                          <div className="hpr_colBoxCatIcon col-4">
                            <FontAwesomeIcon icon={val.icon} />
                          </div>
                          <div className="hpr_colBoxCatTxtWrapper col-8">
                            <div className="hpr_colBoxCatTxtSmallLabel">
                              {val.name}
                            </div>
                          </div>
                        </div>
                      </Link>
                    </div>
                  ))}
                </Fragment>
              )}

              {currentRole === 'manager' && (
                <Fragment>
                  {EMP_CONST.EXECUTIVE_MENU_LIST.map((val) => {
                    return (
                      val.name.toLocaleLowerCase() !== 'services' &&
                      val.name.toLocaleLowerCase() !== 'executives' && (
                        <div className="col equalHCol">
                          <Link
                            className={`hpr_colBoxCatWrapper ${
                              window.location.href
                                .split('/')
                                .includes(val.name.toLowerCase())
                                ? 'activeColBox'
                                : ''
                            }`}
                            to={`/${val.link}`}
                          >
                            <div className="row justify-content-center align-items-center h-100">
                              <div className="hpr_colBoxCatIcon col-4">
                                <FontAwesomeIcon icon={val.icon} />
                              </div>
                              <div className="hpr_colBoxCatTxtWrapper col-8">
                                <div className="hpr_colBoxCatTxtSmallLabel">
                                  {val.name}
                                </div>
                              </div>
                            </div>
                          </Link>
                        </div>
                      )
                    );
                  })}
                </Fragment>
              )}

              {currentRole === 'executive' && (
                <Fragment>
                  {EMP_CONST.EXECUTIVE_MENU_LIST.map((val) => {
                    return (
                      val.name.toLocaleLowerCase() !== 'executives' &&
                      val.name.toLocaleLowerCase() !== 'mis' && (
                        <div className="col equalHCol">
                          <Link
                            className={`hpr_colBoxCatWrapper ${
                              window.location.href.indexOf(
                                val.name.toString().toLowerCase()
                              ) > -1
                                ? 'activeColBox'
                                : ''
                            }`}
                            to={`/${val.link}`}
                          >
                            <div className="row justify-content-center align-items-center h-100">
                              <div className="hpr_colBoxCatIcon col-4">
                                <FontAwesomeIcon icon={val.icon} />
                              </div>
                              <div className="hpr_colBoxCatTxtWrapper col-8">
                                <div className="hpr_colBoxCatTxtSmallLabel">
                                  {val.name}
                                </div>
                              </div>
                            </div>
                          </Link>
                        </div>
                      )
                    );
                  })}
                </Fragment>
              )}

              {currentRole === 'customer' && (
                <Fragment>
                  {EMP_CONST.CUST_MENU_LIST.map((val) => (
                    <div className="col equalHCol">
                      <Link
                        className={`hpr_colBoxCatWrapper ${
                          window.location.href.indexOf(
                            val.name.toString().toLowerCase()
                          ) > -1
                            ? 'activeColBox'
                            : ''
                        }`}
                        to={`/${val.link}`}
                      >
                        <div className="row justify-content-center align-items-center h-100">
                          <div className="hpr_colBoxCatIcon col-4">
                            <FontAwesomeIcon icon={val.icon} />
                          </div>
                          <div className="hpr_colBoxCatTxtWrapper col-8">
                            <div className="hpr_colBoxCatTxtSmallLabel">
                              {val.name}
                            </div>
                          </div>
                        </div>
                      </Link>
                    </div>
                  ))}
                </Fragment>
              )}
            </div>
          ) : (
            // Only for Mobiles
            <div className="hpr-mobile-main-menu">
              <SimpleBarReact className="hpr-main-menu-scroll">
                <div className="d-flex">
                  {currentUser.role === 'hr' &&
                    props.isNestedRoute !== null &&
                    !props.isNestedRoute && (
                      <Fragment>
                        {EMP_CONST.HR_MENU_LIST.map((val) => (
                          <Link
                            className={`hpr-mm-child ${
                              window.location.href.indexOf(
                                val.name.toString().toLowerCase()
                              ) > -1
                                ? 'active'
                                : ''
                            }`}
                            to={`/${val.link}`}
                          >
                            <FontAwesomeIcon icon={val.icon} />
                            {val.name}
                          </Link>
                        ))}
                      </Fragment>
                    )}

                  {currentRole === 'executive' &&
                    props.isNestedRoute !== null &&
                    !props.isNestedRoute && (
                      <Fragment>
                        {EMP_CONST.EXECUTIVE_MENU_LIST.map((val) => {
                          return (
                            val.name.toLocaleLowerCase() !== 'mis' && (
                              <Link
                                className={`hpr-mm-child ${
                                  window.location.href.indexOf(
                                    val.name.toString().toLowerCase()
                                  ) > -1
                                    ? 'active'
                                    : ''
                                }`}
                                to={`/${val.link}`}
                              >
                                <FontAwesomeIcon icon={val.icon} />
                                {val.name}
                              </Link>
                            )
                          );
                        })}
                      </Fragment>
                    )}

                  {currentRole === 'manager' &&
                    props.isNestedRoute !== null &&
                    !props.isNestedRoute && (
                      <Fragment>
                        {EMP_CONST.EXECUTIVE_MENU_LIST.map((val) => {
                          return (
                            val.name.toLocaleLowerCase() !== 'services' && (
                              <Link
                                className={`hpr-mm-child ${
                                  window.location.href
                                    .split('/')
                                    .includes(val.name.toLowerCase())
                                    ? 'active'
                                    : ''
                                }`}
                                to={`/${val.link}`}
                              >
                                <FontAwesomeIcon icon={val.icon} />
                                {val.name}
                              </Link>
                            )
                          );
                        })}
                      </Fragment>
                    )}

                  {currentUser.role === 'customer' &&
                    props.isNestedRoute !== null &&
                    !props.isNestedRoute && (
                      <Fragment>
                        {EMP_CONST.CUST_MENU_LIST.map((val) => (
                          <Link
                            className={`hpr-mm-child ${
                              window.location.href.indexOf(
                                val.name.toString().toLowerCase()
                              ) > -1
                                ? 'active'
                                : ''
                            }`}
                            to={`/${val.link}`}
                          >
                            <FontAwesomeIcon icon={val.icon} />
                            {val.name}
                          </Link>
                        ))}
                      </Fragment>
                    )}
                </div>
              </SimpleBarReact>
            </div>
          )}
        </Fragment>
      )}
    </Fragment>
  );
  return menuTilesTemplate;
});

export default MenuTiles;
