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

import AddPolicy from '../../../commonPages/addPolicy/AddPolicy';

const ExeAddPolicy = React.memo((props) => {
  // console.log('ExeAddPolicy props ', props);

  const [isMobile, setIsMobile] = useState(null);

  useEffect(() => {
    PubSub.subscribe(PubSub.events.IS_MOBILE, (flag) => {
      setIsMobile(flag);
    });
    return () => {
      PubSub.unsubscribe(PubSub.events.IS_MOBILE);
    };
  }, []);

  const exeAddPolicyTemplate = (
    <Fragment>
      <div className="hpr_pageHeadingWrapper">
        <div className="hpr_page-heading-left-wrapper">
          <div className="hpr-breadcrumb-wrapper">
            <Link to={'/executive-home/policies'}>
              <FontAwesomeIcon icon="chevron-left" className="mr-1" />
              Back
            </Link>
          </div>
          <h3 className="">Add Policy</h3>
        </div>
      </div>
      <div className="row">
        <div className="col-12">
          <AddPolicy
            propObj={{
              redirectURL: '/executive-home/policies/list-policies',
              methodType: 'post',
            }}
          ></AddPolicy>
        </div>
      </div>
    </Fragment>
  );

  return exeAddPolicyTemplate;
});

export default ExeAddPolicy;
