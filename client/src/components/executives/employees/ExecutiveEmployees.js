import React, { Fragment, useContext, useState, useEffect } from 'react';

import {
  BrowserRouter as Router,
  Route,
  Redirect,
  Switch,
  Link,
  useHistory,
} from 'react-router-dom';

import ExePendingActions from './pendingActions/ExePendingActions';
import ExecutiveListEmployee from './listEmployee/ExecutiveListEmployee';
import ExeViewDependants from './viewDependants/ExeViewDependants';
import ExeAddEmployee from './addEmployee/ExeAddEmployee';
import ExeBulkUploadEmployee from './bulkUploadEmployee/ExeBulkUploadEmployee';
import ExeBulkUploadDependents from './bulkUploadDependents/ExeBulkUploadDependents';

import ViewCommonDetails from '../../commonPages/viewCommonDetails/ViewCommonDetails';

import { EMP_CONST } from '../../../services/Constants';

const ExecutiveEmployees = React.memo((props) => {
  // console.log('ExecutiveEmployees props ', props);

  if (
    props.isMobile !== null &&
    !props.isMobile &&
    props.location.pathname === props.match.path
  ) {
    return <Redirect to={`${props.location.pathname}/list-employees`} />;
  }

  const executiveEmployeesTemplate = (
    <Fragment>
      {!props.isNestedRoute && !!props.isMobile && (
        <div className="hpr-nested-list-items">
          {EMP_CONST.EXECUTIVE_EMPLOYEES_SUB_MENU.map((val) => (
            <Link
              to={`${props.homePath}/employees/${val.link}`}
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
          path={`${props.homePath}/employees/pending-actions`}
          component={ExePendingActions}
        />
        <Route
          exact
          path={`${props.homePath}/employees/pending-actions/:employeeId`}
          component={ViewCommonDetails}
        />
        <Route
          exact
          path={`${props.homePath}/employees/list-employees`}
          component={ExecutiveListEmployee}
        />

        <Route
          path={`${props.homePath}/employees/list-employees/:employeeId`}
          component={ViewCommonDetails}
        />

        <Route
          path={`${props.homePath}/employees/add-employee`}
          component={ExeAddEmployee}
        />

        <Route
          path={`${props.homePath}/employees/bulk-upload-employee`}
          component={ExeBulkUploadEmployee}
        />
        <Route
          path={`${props.homePath}/employees/bulk-upload-dependents`}
          component={ExeBulkUploadDependents}
        />

        <Route
          exact
          path={`${props.homePath}/employees/:employeeId/view-dependants`}
          component={ExeViewDependants}
        />

        <Route
          path={`${props.homePath}/employees/:employeeId/view-dependants/:firstName`}
          component={ViewCommonDetails}
        />
      </Switch>
    </Fragment>
  );

  return executiveEmployeesTemplate;
});

export default ExecutiveEmployees;
