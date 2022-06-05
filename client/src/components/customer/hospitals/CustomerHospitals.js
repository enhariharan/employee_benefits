import React, { Fragment, useContext, useState, useEffect } from 'react';

import CustomerNetworkHospitals from './customerNetworkHospitals/CustomerNetworkHospitals';
import ViewCommonDetails from '../../commonPages/viewCommonDetails/ViewCommonDetails';

import { EMP_CONST } from '../../../services/Constants';

import {
  BrowserRouter as Router,
  Route,
  Redirect,
  Switch,
  Link,
  useHistory,
} from 'react-router-dom';

const CustomerHospitals = React.memo((props) => {
  // console.log('CustomerHospitals props ', props);

  if (
    props.isMobile !== null &&
    !props.isMobile &&
    props.location.pathname === props.match.path
  ) {
    return <Redirect to={`${props.location.pathname}/network-hospitals`} />;
  }

  const customerHospitalsTemplate = (
    <Fragment>
      {props.isNestedRoute !== null &&
        !props.isNestedRoute &&
        props.isMobile !== null &&
        !!props.isMobile && (
          <div className="hpr-nested-list-items">
            {EMP_CONST.CUST_HOSPITALS_SUB_MENU.map((val) => (
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
          component={CustomerNetworkHospitals}
        />
        <Route
          path={`${props.homePath}/hospitals/network-hospitals/:hospitalId`}
          component={ViewCommonDetails}
        />
      </Switch>
    </Fragment>
  );

  return customerHospitalsTemplate;
});

export default CustomerHospitals;
