import React, { Fragment, useContext, useState, useEffect } from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './exeAddExecutives.scss';
import {
  BrowserRouter as Router,
  Route,
  Redirect,
  Switch,
  Link,
  useHistory,
} from 'react-router-dom';

import AddExecutive from '../../../commonPages/addExecutive/AddExecutive';

const ExeAddExecutives = React.memo((props) => {
  // console.log('ExeAddCorporates props ', props);

  const exeAddExecutivesTemplate = (
    <Fragment>
      <div className="hpr_pageHeadingWrapper">
        <div className="hpr_page-heading-left-wrapper">
          <div className="hpr-breadcrumb-wrapper">
            <Link to={'/executive-home/executives'}>
              <FontAwesomeIcon icon="chevron-left" className="mr-1" />
              Back
            </Link>
          </div>
          <h3 className="">Add Executive</h3>
        </div>
      </div>

      <div className="row">
        <div className="col-lg-12">
          <AddExecutive
            propObj={{
              redirectURL: '/executive-home/executives/list-executives',
              methodType: 'post',
            }}
          ></AddExecutive>
        </div>
      </div>
    </Fragment>
  );

  return exeAddExecutivesTemplate;
});

export default ExeAddExecutives;
