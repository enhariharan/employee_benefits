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
import ExeListExecutives from './listExecutives/ExeListExecutives';
import ExeAddExecutives from './addExecutives/ExeAddExecutives';

import { EMP_CONST } from '../../../services/Constants';

const ExeExecutives = React.memo((props) => {
  // console.log('ExeExecuives props ', props);

  if (
    props.isMobile !== null &&
    !props.isMobile &&
    props.location.pathname === props.match.path
  ) {
    return <Redirect to={`${props.location.pathname}/list-executives`} />;
  }

  const exeExecutivesTemplate = (
    <Fragment>
      {!props.isNestedRoute && !!props.isMobile && (
        <div className="hpr-nested-list-items">
          {EMP_CONST.EXECUTIVE_EXECUTIVES_SUB_MENU.map((val) => (
            <Link
              to={`${props.homePath}/executives/${val.link}`}
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
          path={`${props.homePath}/executives/list-executives`}
          component={ExeListExecutives}
        />

        <Route
          path={`${props.homePath}/executives/list-executives/:executiveId`}
          component={ViewCommonDetails}
        />
        <Route
          exact
          path={`${props.homePath}/executives/add-executive`}
          component={ExeAddExecutives}
        />
      </Switch>
    </Fragment>
  );

  return exeExecutivesTemplate;
});

export default ExeExecutives;
