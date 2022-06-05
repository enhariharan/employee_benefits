import React, { Fragment, useContext, useState, useEffect } from 'react';

import {
  BrowserRouter as Router,
  Route,
  Redirect,
  Switch,
  Link,
  useHistory,
} from 'react-router-dom';

import { EMP_CONST } from '../../../services/Constants';

import ExeNetworkHospitals from './networkHospitals/ExeNetworkHospitals';
import ViewCommonDetails from '../../commonPages/viewCommonDetails/ViewCommonDetails';

const ExeHospitals = React.memo((props) => {
  // console.log('ExeHospitals props ', props);

  if (
    props.isMobile !== null &&
    !props.isMobile &&
    props.location.pathname === props.match.path
  ) {
    return <Redirect to={`${props.location.pathname}/network-hospitals`} />;
  }

  const exeHospitalsTemplate = (
    <Fragment>
      {!props.isNestedRoute && !!props.isMobile && (
        <div className="hpr-nested-list-items">
          {EMP_CONST.EXECUTIVE_HOSPITALS_SUB_MENU.map((val) => (
            <Link
              to={`${props.homePath}/hospitals/${val.link}`}
              className="link"
            >
              {val.name}
            </Link>
          ))}
        </div>
      )}

      <Switch>
        <Route
          exact
          path={`${props.homePath}/hospitals/network-hospitals`}
          component={ExeNetworkHospitals}
        />

        <Route
          path={`${props.homePath}/hospitals/network-hospitals/:hospitalId`}
          component={ViewCommonDetails}
        />
      </Switch>
    </Fragment>
  );

  return exeHospitalsTemplate;
});

export default ExeHospitals;
