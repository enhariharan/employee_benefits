import React, { Fragment, useContext, useState, useEffect } from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './hrAddDependent.scss';
import {
  BrowserRouter as Router,
  Route,
  Redirect,
  Switch,
  Link,
  useHistory,
} from 'react-router-dom';

import AddDependent from '../../../commonPages/addDependent/AddDependent';

const HrAddDependent = React.memo((props) => {
  // console.log('HrAddDependent props ', props);
  const history = useHistory();

  const hrAddDependentTemplate = (
    <Fragment>
      <div className="hpr_pageHeadingWrapper">
        <div className="hpr_page-heading-left-wrapper">
          <div className="hpr-breadcrumb-wrapper">
            <a style={{ cursor: 'pointer' }} onClick={history.goBack}>
              <FontAwesomeIcon icon="chevron-left" className="mr-1" />
              Back
            </a>
          </div>
          <h3 className="">Add Dependent</h3>
        </div>
      </div>
      <div className="row">
        <div className="col-12">
          <AddDependent
            propObj={{
              redirectURL: '/hr-home/employees/list-employees',
            }}
          ></AddDependent>
        </div>
      </div>
    </Fragment>
  );

  return hrAddDependentTemplate;
});

export default HrAddDependent;
