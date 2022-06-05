import React, { Fragment, useContext, useState, useEffect } from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './customerIntiateClaim.scss';
import {
  BrowserRouter as Router,
  Route,
  Redirect,
  Switch,
  Link,
  useHistory,
} from 'react-router-dom';

import { PubSub } from '../../../../services/PubSub';

const CustomerIntiateClaim = React.memo((props) => {
  console.log('CustomerIntiateClaim props ', props);
  const [isMobile, setIsMobile] = useState(null);
  useEffect(() => {
    PubSub.subscribe(PubSub.events.IS_MOBILE, (flag) => {
      setIsMobile(flag);
    });
    return () => {
      PubSub.unsubscribe(PubSub.events.IS_MOBILE);
    };
  }, []);

  const customerIntiateClaimTemplate = (
    <Fragment>
      <div className="hpr_pageHeadingWrapper">
        <div className="hpr_page-heading-left-wrapper">
          <div className="hpr-breadcrumb-wrapper">
            <Link to={'/customer-home/claims'}>
              <FontAwesomeIcon icon="chevron-left" className="mr-1" />
              Back
            </Link>
          </div>
          <h3 className="">Intiate Claim</h3>
        </div>
      </div>
    </Fragment>
  );

  return customerIntiateClaimTemplate;
});

export default CustomerIntiateClaim;
