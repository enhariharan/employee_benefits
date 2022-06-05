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

import AddEmployee from '../../../commonPages/addEmployee/AddEmployee';

const ExeAddEmployee = React.memo((props) => {
  const exeAddEmployeeTemplate = (
    <Fragment>
      <div className="hpr_pageHeadingWrapper">
        <div className="hpr_page-heading-left-wrapper">
          <div className="hpr-breadcrumb-wrapper">
            <Link to={'/executive-home/employees'}>
              <FontAwesomeIcon icon="chevron-left" className="mr-1" />
              Back
            </Link>
          </div>
          <h3 className="">Add Employee</h3>
        </div>
      </div>
      <div className="row">
        <div className="col-12">
          <AddEmployee
            propObj={{
              redirectURL: '/executive-home/employees/list-employees',
              methodType: 'post',
            }}
          ></AddEmployee>
        </div>
      </div>
    </Fragment>
  );

  return exeAddEmployeeTemplate;
});

export default ExeAddEmployee;
