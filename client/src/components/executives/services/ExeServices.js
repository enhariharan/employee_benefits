import React, { Fragment, useContext, useState, useEffect } from 'react';

import {
  BrowserRouter as Router,
  Route,
  Redirect,
  Switch,
  Link,
  useHistory,
} from 'react-router-dom';

import ViewCommonDetails from '../../commonPages/viewCommonDetails/ViewCommonDetails';
import ExeGetAllIssues from './listAllIssues/ExeGetAllIssues';
import ExeGetAllCBRequest from './listAllCBRequest/ExeGetAllCBRequest';

import { EMP_CONST } from '../../../services/Constants';

const ExeServices = React.memo((props) => {
  if (
    props.isMobile !== null &&
    !props.isMobile &&
    props.location.pathname === props.match.path
  ) {
    return <Redirect to={`${props.location.pathname}/callback-enquiry-list`} />;
  }

  const exeServicesTemplate = (
    <Fragment>
      {!props.isNestedRoute && !!props.isMobile && (
        <div className="hpr-nested-list-items">
          {EMP_CONST.EXECUTIVE_SERVICES_SUB_MENU.map((val) => (
            <Link
              to={`${props.homePath}/services/${val.link}`}
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
          path={`${props.homePath}/services/callback-enquiry-list`}
          component={ExeGetAllCBRequest}
        />
        <Route
          path={`${props.homePath}/services/callback-enquiry-list/:complaintId`}
          component={ViewCommonDetails}
        />
        <Route
          exact
          path={`${props.homePath}/services/issues-list`}
          component={ExeGetAllIssues}
        />
        <Route
          path={`${props.homePath}/services/issues-list/:complaintId`}
          component={ViewCommonDetails}
        />
      </Switch>
    </Fragment>
  );

  return exeServicesTemplate;
});

export default ExeServices;
