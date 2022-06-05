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
import ExeListPolicies from './listPolicies/ExeListPolicies';
import ExeAddPolicy from './addPolicy/ExeAddPolicy';
import ExeEditPolicy from './editPolicy/ExeEditPolicy';

import { EMP_CONST } from '../../../services/Constants';

const ExePolicies = React.memo((props) => {
  // console.log('ExePolicies props ', props);

  if (
    props.isMobile !== null &&
    !props.isMobile &&
    props.location.pathname === props.match.path
  ) {
    return <Redirect to={`${props.location.pathname}/list-policies`} />;
  }

  const exePoliciesTemplate = (
    <Fragment>
      {!props.isNestedRoute && !!props.isMobile && (
        <div className="hpr-nested-list-items">
          {EMP_CONST.EXECUTIVE_POLICIES_SUB_MENU.map((val) => (
            <Link
              to={`${props.homePath}/policies/${val.link}`}
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
          path={`${props.homePath}/policies/list-policies`}
          component={ExeListPolicies}
        />
        <Route
          path={`${props.homePath}/policies/list-policies/:policyId`}
          component={ViewCommonDetails}
        />
        <Route
          path={`${props.homePath}/policies/edit-policy/:policyId`}
          component={ExeEditPolicy}
        />
        <Route
          exact
          path={`${props.homePath}/policies/add-policy`}
          component={ExeAddPolicy}
        />
      </Switch>
    </Fragment>
  );

  return exePoliciesTemplate;
});

export default ExePolicies;
