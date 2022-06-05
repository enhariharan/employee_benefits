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

import { PubSub } from '../../../../services/PubSub';
import ApiService from '../../../../services/ApiService';
import { EMP_CONST } from '../../../../services/Constants';
import { AuthContext } from '../../../../context/AuthContext';

import GetAllDependants from '../../../commonPages/getAllDependants/GetAllDependants';

const HrViewDependants = React.memo((props) => {
  // console.log('HrViewDependants props ', props);
  const history = useHistory();
  const [listDependantsData, setListDependantsData] = useState([]);
  const [currentUser] = useContext(AuthContext);
  useEffect(() => {
    getListDependants();
  }, []);

  const getListDependants = () => {
    if (
      currentUser === null ||
      (!history.location.state && !history.location.state.empId)
    ) {
      return;
    }
    ApiService.get(
      `${EMP_CONST.URL.exe_createCustomers}/${history.location.state.empId}/dependents?corporateUuid=${currentUser.corporateUuid}`
    )
      .then((response) => {
        // console.log('response getListEmployees ', response);
        if (typeof response !== 'undefined') {
          setListDependantsData(response.data.dependents);
        }
      })
      .catch((err) => {
        console.log(`Resend Error ${JSON.stringify(err)} `);
        if (!!err.data && (!!err.data.errCode || !!err.data.message)) {
          let respNotiObj = {
            message: err.data.message || err.data.errCode,
            color: 'error',
          };
          PubSub.publish(PubSub.events.SNACKBAR_PROVIDER, respNotiObj);
        }
      })
      .finally(() => {
        console.log(`Finally `);
      });
  };

  const viewDetailsData = {
    pageHeading: 'View Details',
    detailsPath: '/hr-home/employees',
    empId: !!history.location.state ? history.location.state.empId : null,
  };

  const hrViewDependantsTemplate = (
    <Fragment>
      <div className="hpr_pageHeadingWrapper">
        <div className="hpr_page-heading-left-wrapper">
          <div className="hpr-breadcrumb-wrapper">
            <a style={{ cursor: 'pointer' }} onClick={history.goBack}>
              <FontAwesomeIcon icon="chevron-left" className="mr-1" />
              Back
            </a>
          </div>
          <h3 className="">{history.location.state.empId} Dependants</h3>
        </div>
      </div>

      <div className="row">
        <div className="col-12">
          {!!listDependantsData && (
            <GetAllDependants
              flexTableArray={listDependantsData}
              data={viewDetailsData}
            />
          )}
        </div>
      </div>
    </Fragment>
  );

  return hrViewDependantsTemplate;
});

export default HrViewDependants;
