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
import ExeListCorporates from './listCorporates/ExeListCorporates';
import ExeAddCorporates from './addCorporates/ExeAddCorporates';
import ExeEditCorporate from './editCorporate/ExeEditCorporate';

import { EMP_CONST } from '../../../services/Constants';

const ExeCorporates = React.memo((props) => {
  // console.log('ExeCorporates props ', props);

  if (
    props.isMobile !== null &&
    !props.isMobile &&
    props.location.pathname === props.match.path
  ) {
    return <Redirect to={`${props.location.pathname}/list-corporates`} />;
  }

  const exeCorporatesTemplate = (
    <Fragment>
      {!props.isNestedRoute && !!props.isMobile && (
        <div className="hpr-nested-list-items">
          {EMP_CONST.EXECUTIVE_CORPORATES_SUB_MENU.map((val) => (
            <Link
              to={`${props.homePath}/corporates/${val.link}`}
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
          path={`${props.homePath}/corporates/list-corporates`}
          component={ExeListCorporates}
        />
        <Route
          path={`${props.homePath}/corporates/edit-corporate/:displayName`}
          component={ExeEditCorporate}
        />
        <Route
          path={`${props.homePath}/corporates/list-corporates/:corporateId`}
          component={ViewCommonDetails}
        />
        <Route
          exact
          path={`${props.homePath}/corporates/add-corporate`}
          component={ExeAddCorporates}
        />
      </Switch>
    </Fragment>
  );

  return exeCorporatesTemplate;
});

export default ExeCorporates;
