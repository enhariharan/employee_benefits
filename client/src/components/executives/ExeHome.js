import React, { Fragment, useContext, useState, useEffect } from 'react';

import Header from '../header/Header.jsx';
import LeftMenu from '../leftNav/LeftMenu.jsx';
import MenuTiles from '../menuTiles/MenuTiles';

import ExeMIS from './mis/ExeMIS';
import ExeExecutives from './executives/ExeExecutives';
import ExeCorporates from './corporates/ExeCorporates';
import ExecutiveEmployees from './employees/ExecutiveEmployees';
import ExeClaims from './claims/ExeClaims';
import ExePolicies from './policies/ExePolicies';
import ExeHospitals from './hospitals/ExeHospitals';
import ExeServices from './services/ExeServices';

import ReactResizeDetector from 'react-resize-detector';

import { PubSub } from '../../services/PubSub';

import './exeHome.scss';
import {
  BrowserRouter as Router,
  Route,
  Redirect,
  Switch,
  Link,
  useHistory,
} from 'react-router-dom';

const ExeHome = React.memo((props) => {
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
    (props.location.pathname === '/executive-home/' ||
      props.location.pathname === '/executive-home')
  ) {
    return <Redirect to="/executive-home/corporates" />;
  }

  const exeHomeTemplate = (
    <Fragment>
      <ReactResizeDetector
        handleWidth
        handleHeight
        refreshMode="debounce"
        refreshRate={200}
        onResize={windowOnResize}
      >
        <Header notifyRedirectUrl="/executive-home/employees/pending-actions" />
        {isMobile !== null && isNestedRoute !== null && (
          <LeftMenu />
          // <LeftMenu props={props} />
        )}
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
                    path={`/executive-home/mis`}
                    render={(props) => (
                      <ExeMIS
                        {...props}
                        homePath={path}
                        isMobile={isMobile}
                        isNestedRoute={isNestedRoute}
                      />
                    )}
                  />
                  <Route
                    path={`/executive-home/executives`}
                    render={(props) => (
                      <ExeExecutives
                        {...props}
                        homePath={path}
                        isMobile={isMobile}
                        isNestedRoute={isNestedRoute}
                      />
                    )}
                  />
                  <Route
                    path={`/executive-home/corporates`}
                    render={(props) => (
                      <ExeCorporates
                        {...props}
                        homePath={path}
                        isMobile={isMobile}
                        isNestedRoute={isNestedRoute}
                      />
                    )}
                  />

                  <Route
                    path={`/executive-home/policies`}
                    render={(props) => (
                      <ExePolicies
                        {...props}
                        homePath={path}
                        isMobile={isMobile}
                        isNestedRoute={isNestedRoute}
                      />
                    )}
                  />

                  <Route
                    path={`/executive-home/employees`}
                    render={(props) => (
                      <ExecutiveEmployees
                        {...props}
                        homePath={path}
                        isMobile={isMobile}
                        isNestedRoute={isNestedRoute}
                      />
                    )}
                  />

                  <Route
                    path={`/executive-home/claims`}
                    render={(props) => (
                      <ExeClaims
                        {...props}
                        homePath={path}
                        isMobile={isMobile}
                        isNestedRoute={isNestedRoute}
                      />
                    )}
                  />
                  <Route
                    path={`/executive-home/hospitals`}
                    render={(props) => (
                      <ExeHospitals
                        {...props}
                        homePath={path}
                        isMobile={isMobile}
                        isNestedRoute={isNestedRoute}
                      />
                    )}
                  />

                  <Route
                    path={`/executive-home/services`}
                    render={(props) => (
                      <ExeServices
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

  return exeHomeTemplate;
});

export default ExeHome;
