import React, { Fragment, useContext, useState, useEffect } from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  BrowserRouter as Router,
  Route,
  Redirect,
  Switch,
  Link,
  useHistory,
} from 'react-router-dom';

import AddCorporate from '../../../commonPages/addCorporate/AddCorporate';

const ExeEditCorporate = React.memo((props) => {
  // console.log('ExeEditCorporate props ', props);

  const exeEditCorporateTemplate = (
    <Fragment>
      <div className="hpr_pageHeadingWrapper">
        <div className="hpr_page-heading-left-wrapper">
          <div className="hpr-breadcrumb-wrapper">
            <Link to={'/executive-home'}>
              <FontAwesomeIcon icon="chevron-left" className="mr-1" />
              Back
            </Link>
          </div>
          <h3 className="">Edit Corporate</h3>
        </div>
      </div>

      <div className="row">
        <div className="col-lg-12">
          <AddCorporate
            propObj={{
              redirectURL: '/executive-home/corporates/list-corporates',
              currentObj: props.location.state.currentObj,
              methodType: 'put',
            }}
          ></AddCorporate>
        </div>
      </div>
    </Fragment>
  );

  return exeEditCorporateTemplate;
});

export default ExeEditCorporate;
