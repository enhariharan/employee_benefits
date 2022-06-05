import React, { Fragment, useContext, useState, useEffect } from 'react';

import {
  BrowserRouter as Router,
  Route,
  Redirect,
  Switch,
  Link,
  useHistory,
} from 'react-router-dom';

import HrNetworkHospitals from './networkHospitals/HrNetworkHospitals';
import ViewCommonDetails from '../../commonPages/viewCommonDetails/ViewCommonDetails';

import { EMP_CONST } from '../../../services/Constants';

const HrHospitals = React.memo((props) => {
  // console.log('HrHospitals props ', props);

  if (
    props.isMobile !== null &&
    !props.isMobile &&
    props.location.pathname === props.match.path
  ) {
    return <Redirect to={`${props.location.pathname}/network-hospitals`} />;
  }

  const hrHospitalsTemplate = (
    <Fragment>
      {!props.isNestedRoute && !!props.isMobile && (
        <div className="hpr-nested-list-items">
          {EMP_CONST.HR_HOSPITALS_SUB_MENU.map((val) => (
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
          component={HrNetworkHospitals}
        />

        <Route
          path={`${props.homePath}/hospitals/network-hospitals/:hospitalId`}
          component={ViewCommonDetails}
        />
      </Switch>
    </Fragment>
  );

  return hrHospitalsTemplate;
});

export default HrHospitals;
