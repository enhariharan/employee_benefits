import React, { Fragment, useContext, useState, useEffect } from 'react';

import Header from '../header/Header.jsx';
import LeftMenu from '../leftNav/LeftMenu.jsx';
import MenuTiles from '../menuTiles/MenuTiles';

import HrEmployees from './employees/HrEmployees';
import HrClaims from './claims/HrClaims';
import HrPolicies from './policies/HrPolicies';
import HrNetworkHospitals from './hospitals/HrHospitals';

import { PubSub } from '../../services/PubSub';

import ReactResizeDetector from 'react-resize-detector';

import './hrHome.scss';
import {
  BrowserRouter as Router,
  Route,
  Redirect,
  Switch,
  Link,
  useHistory,
} from 'react-router-dom';

const HrHome = React.memo((props) => {
  // console.log('HrHome props ', props);

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
      // console.log('props setIsNestedRoute ', props);
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
    (props.location.pathname === '/hr-home/' ||
      props.location.pathname === '/hr-home')
  ) {
    return <Redirect to="/hr-home/employees" />;
  }

  const hrHomeTemplate = (
    <Fragment>
      <ReactResizeDetector
        handleWidth
        handleHeight
        refreshMode="debounce"
        refreshRate={200}
        onResize={windowOnResize}
      >
        <Header notifyRedirectUrl="/hr-home/employees/pending-actions" />
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
                <Switch>
                  <Route
                    path={`/hr-home/employees`}
                    render={(props) => (
                      <HrEmployees
                        {...props}
                        homePath={path}
                        isMobile={isMobile}
                        isNestedRoute={isNestedRoute}
                      />
                    )}
                  />

                  <Route
                    path={`/hr-home/claims`}
                    render={(props) => (
                      <HrClaims
                        {...props}
                        homePath={path}
                        isMobile={isMobile}
                        isNestedRoute={isNestedRoute}
                      />
                    )}
                  />

                  <Route
                    path={`/hr-home/policies`}
                    render={(props) => (
                      <HrPolicies
                        {...props}
                        homePath={path}
                        isMobile={isMobile}
                        isNestedRoute={isNestedRoute}
                      />
                    )}
                  />
                  <Route
                    path={`/hr-home/hospitals`}
                    render={(props) => (
                      <HrNetworkHospitals
                        {...props}
                        homePath={path}
                        isMobile={isMobile}
                        isNestedRoute={isNestedRoute}
                      />
                    )}
                  />
                </Switch>
              </Fragment>
            )}
          </div>
        </div>
      </ReactResizeDetector>
    </Fragment>
  );

  return hrHomeTemplate;
});

export default HrHome;
