import React, { Fragment, useContext, useState, useEffect } from 'react';

import Header from '../header/Header.jsx';
import LeftMenu from '../leftNav/LeftMenu.jsx';
import MenuTiles from '../menuTiles/MenuTiles';

import CustomerPolicies from './policies/CustomerPolicies';
import CustomerHospitals from './hospitals/CustomerHospitals';
import CustomerClaims from './claims/CustomerClaims';
import CustomerServices from './services/CustomerServices';

// import images
import footerBannerImage from '../../assets/images/footerBanner.png';

import './customerHome.scss';
import {
  BrowserRouter as Router,
  Route,
  Redirect,
  Switch,
  Link,
  useHistory,
} from 'react-router-dom';

import ReactResizeDetector from 'react-resize-detector';

import { PubSub } from '../../services/PubSub';

const CustomerHome = React.memo((props) => {
  // console.log('CustomerHome props ', props);

  const { path } = props.match;

  const windowOnResize = (width) => {
    if (width < 768) {
      PubSub.publish(PubSub.events.IS_MOBILE, true);
    } else {
      PubSub.publish(PubSub.events.IS_MOBILE, false);
    }
  };

  const [isMobile, setIsMobile] = useState(null);
  const [isNestedRoute, setIsNestedRoute] = useState(null);
  useEffect(() => {
    PubSub.subscribe(PubSub.events.IS_MOBILE, (flag) => {
      setIsMobile(flag);
    });
    return () => {
      PubSub.unsubscribe(PubSub.events.IS_MOBILE);
    };
  }, []);

  useEffect(() => {
    windowOnResize(window.innerWidth);
    if (isMobile !== null) {
      let locationPathLength = props.location.pathname.split('/').length,
        mathPathLength = props.match.path.split('/').length;
      locationPathLength - mathPathLength > 1
        ? setIsNestedRoute(true)
        : setIsNestedRoute(false);
    }
  });

  if (
    isMobile !== null &&
    isNestedRoute !== null &&
    (props.location.pathname === '/customer-home/' ||
      props.location.pathname === '/customer-home')
  ) {
    return <Redirect to="/customer-home/policies" />;
  }

  const customerHomeTemplate = (
    <Fragment>
      <ReactResizeDetector
        handleWidth
        handleHeight
        refreshMode="debounce"
        refreshRate={200}
        onResize={windowOnResize}
      >
        <Header />
        <LeftMenu />
        <div className="hpr_mainContent">
          <div className="hpr_pageContentWrapper">
            {isMobile !== null && isNestedRoute !== null && (
              <Fragment>
                <MenuTiles
                  props={props}
                  isMobile={isMobile}
                  isNestedRoute={isNestedRoute}
                />
                <Fragment>
                  {/* {!!isMobile && !isNestedRoute && (
                    <div className="hpr-banner-customer">Banner</div>
                  )} */}

                  <Switch>
                    <Route
                      path={`${path}/policies`}
                      render={(props) => (
                        <CustomerPolicies
                          {...props}
                          homePath={path}
                          isMobile={isMobile}
                          isNestedRoute={isNestedRoute}
                        />
                      )}
                    />
                    <Route
                      path={`${path}/hospitals`}
                      render={(props) => (
                        <CustomerHospitals
                          {...props}
                          homePath={path}
                          isMobile={isMobile}
                          isNestedRoute={isNestedRoute}
                        />
                      )}
                    />

                    <Route
                      path={`${path}/claims`}
                      render={(props) => (
                        <CustomerClaims
                          {...props}
                          homePath={path}
                          isMobile={isMobile}
                          isNestedRoute={isNestedRoute}
                        />
                      )}
                    />
                    <Route
                      path={`${path}/services`}
                      render={(props) => (
                        <CustomerServices
                          {...props}
                          homePath={path}
                          isMobile={isMobile}
                          isNestedRoute={isNestedRoute}
                        />
                      )}
                    />
                  </Switch>
                </Fragment>
              </Fragment>
            )}
          </div>
        </div>
      </ReactResizeDetector>
    </Fragment>
  );

  return customerHomeTemplate;
});

export default CustomerHome;
