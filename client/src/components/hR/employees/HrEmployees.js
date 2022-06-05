import React, { Fragment, useContext, useState, useEffect } from 'react';

import {
  BrowserRouter as Router,
  Route,
  Redirect,
  Switch,
  Link,
  useHistory,
} from 'react-router-dom';

import HrPendingApprovals from './pendingApprovals/HrPendingApprovals';
import ViewCommonDetails from '../../commonPages/viewCommonDetails/ViewCommonDetails';
import HrListEmployees from './listEmployees/HrListEmployees';
import HrViewDependants from './viewDependants/HrViewDependants';
import HrAddEmployee from './addEmployee/HrAddEmployee';
import HrAddDependent from './addDependent/HrAddDependent';
import HrEditEmployee from './editEmployee/HrEditEmployee';
import HrEditDependent from './editDependant/HrEditDependent';
import HrBulkUploadEmployee from './bulkUploadEmployee/HrBulkUploadEmployee';
import HrBulkUploadDependents from './bulkUploadDependents/HrBulkUploadDependents';

import { EMP_CONST } from '../../../services/Constants';

const HrEmployees = React.memo((props) => {
  // console.log('HrEmployees props ', props);

  if (
    props.isMobile !== null &&
    !props.isMobile &&
    props.location.pathname === props.match.path
  ) {
    return <Redirect to={`${props.location.pathname}/list-employees`} />;
  }

  const hrEmployeesTemplate = (
    <Fragment>
      {!props.isNestedRoute && !!props.isMobile && (
        <div className="hpr-nested-list-items">
          {EMP_CONST.HR_EMPLOYEES_SUB_MENU.map((val) => (
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
          component={HrPendingApprovals}
        />

        <Route
          path={`${props.homePath}/employees/pending-actions/:employeeId`}
          component={ViewCommonDetails}
        />
        <Route
          path={`${props.homePath}/employees/edit-employee/:employeeId`}
          component={HrEditEmployee}
        />

        <Route
          exact
          path={`${props.homePath}/employees/list-employees`}
          component={HrListEmployees}
        />
        <Route
          exact
          path={`${props.homePath}/employees/:employeeId/view-dependants`}
          component={HrViewDependants}
        />
        <Route
          path={`${props.homePath}/employees/:employeeId/view-dependants/:firstName`}
          component={ViewCommonDetails}
        />

        <Route
          path={`${props.homePath}/employees/list-employees/:employeeId`}
          component={ViewCommonDetails}
        />

        <Route
          exact
          path={`${props.homePath}/employees/add-employee`}
          component={HrAddEmployee}
        />

        <Route
          exact
          path={`${props.homePath}/employees/add-dependent`}
          component={HrAddDependent}
        />
        <Route
          exact
          path={`${props.homePath}/employees/bulk-upload-employee`}
          component={HrBulkUploadEmployee}
        />
        <Route
          exact
          path={`${props.homePath}/employees/bulk-upload-dependents`}
          component={HrBulkUploadDependents}
        />
        <Route
          exact
          path={`${props.homePath}/employees/edit-dependant/:firstName`}
          component={HrEditDependent}
        />
      </Switch>
    </Fragment>
  );

  return hrEmployeesTemplate;
});

export default HrEmployees;
