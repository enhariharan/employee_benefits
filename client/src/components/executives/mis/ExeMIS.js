import React, { Fragment, useContext, useState, useEffect } from 'react';

import {
  BrowserRouter as Router,
  Route,
  Redirect,
  Switch,
  Link,
  useHistory,
} from 'react-router-dom';

import ExeClaimsReport from './claimsReport/ExeClaimsReport';
import ExePolicyReport from './policyReport/ExePolicyReport';

import { EMP_CONST } from '../../../services/Constants';

const ExeMIS = React.memo((props) => {
  // console.log('ExeMIS props ', props);

  if (
    props.isMobile !== null &&
    !props.isMobile &&
    props.location.pathname === props.match.path
  ) {
    return <Redirect to={`${props.location.pathname}/claims-report`} />;
  }

  const exeMISTemplate = (
    <Fragment>
      {!props.isNestedRoute && !!props.isMobile && (
        <div className="hpr-nested-list-items">
          {EMP_CONST.EXECUTIVE_MIS_SUB_MENU.map((val) => (
            <Link to={`${props.homePath}/mis/${val.link}`} className="link">
              {val.name}
            </Link>
          ))}
        </div>
      )}

      <Switch>
        <Route
          exact
          path={`${props.homePath}/mis/claims-report`}
          component={ExeClaimsReport}
        />
        <Route
          path={`${props.homePath}/mis/policy-premium-report`}
          component={ExePolicyReport}
        />
      </Switch>
    </Fragment>
  );

  return exeMISTemplate;
});

export default ExeMIS;
