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

import MomentReg from 'moment';

import { Button } from '@material-ui/core';

import './exeGetAllCBRequest.scss';

import DateFnsUtils from '@date-io/date-fns';
import { MuiPickersUtilsProvider, DatePicker } from '@material-ui/pickers';

import { PubSub } from '../../../../services/PubSub';
import ApiService from '../../../../services/ApiService';
import { EMP_CONST } from '../../../../services/Constants';
import { AuthContext } from '../../../../context/AuthContext';
import { GlobalDataContext } from '../../../../context/GlobalDataContext';

import GetCBRequestList from '../../../commonPages/getCBRequestList/GetCBRequestList';

const ExeGetAllCBRequest = React.memo((props) => {
  const [globalOnLoadData, setGlobalOnLoadData] = useContext(GlobalDataContext);
  // console.log('globalOnLoadData ExeGetAllCBRequest ', globalOnLoadData);

  let isGlobalData;
  !!globalOnLoadData &&
  Object.keys(globalOnLoadData).length > 0 &&
  !!globalOnLoadData.exeGetAllCBRequest
    ? (isGlobalData = true)
    : (isGlobalData = false);

  const [isMobile, setIsMobile] = useState(null);
  const [getAllCBRequest, setGetAllCBRequest] = useState(
    (!!isGlobalData && globalOnLoadData.exeGetAllCBRequest) || []
  );

  const [fromDate, setFromDate] = useState(
    MomentReg().add(-1, 'months').format('YYYY/MM/DD')
  );
  const [toDate, setToDate] = useState(
    MomentReg(new Date()).format('YYYY/MM/DD')
  );

  const handleFromDateChange = (e) => {
    if (!!e) {
      setFromDate(e);
    }
  };
  const handleToDateChange = (e) => {
    if (!!e) {
      setToDate(e);
    }
  };

  const [currentUser] = useContext(AuthContext);

  useEffect(() => {
    getAllCBReuestByDt();

    PubSub.subscribe(PubSub.events.IS_MOBILE, (flag) => {
      setIsMobile(flag);
    });
    return () => {
      PubSub.unsubscribe(PubSub.events.IS_MOBILE);
    };
  }, []);

  const getAllCBReuestByDt = () => {
    let pageUrl;

    if (!!fromDate) {
      let fromDateModify = MomentReg(fromDate, 'YYYY/MM/DD').format(
        'YYYY/MM/DD'
      );
      pageUrl = `${EMP_CONST.URL.exe_getAllCBReuest}?fromDate=${fromDateModify}`;
    }

    if (!!toDate) {
      let toDateModify = MomentReg(toDate, 'YYYY/MM/DD').format('YYYY/MM/DD');
      pageUrl = `${pageUrl}&toDate=${toDateModify}`;
    }

    ApiService.get(pageUrl)
      .then((response) => {
        // console.log('response getAllIssuesByDt ', response);
        if (typeof response !== 'undefined' && response.errCode === 'Success') {
          setGetAllCBRequest(response.data);
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
    detailsPath: '/executive-home/services/issues-list',
    isExecutive: true,
  };

  const exeGetAllCBRequestTemplate = (
    <Fragment>
      <div className="hpr_pageHeadingWrapper">
        <div className="hpr_page-heading-left-wrapper">
          {!!isMobile && (
            <div className="hpr-breadcrumb-wrapper">
              <Link to={'/executive-home/policies'}>
                <FontAwesomeIcon icon="chevron-left" className="mr-1" />
                Back
              </Link>
            </div>
          )}
          <h3 className="">Callback Request List</h3>
        </div>

        <div className="hpr-flex-table-filter-sort-wrapper align-items-center hpr-exe-services-wrapper">
          <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <DatePicker
              inputVariant="outlined"
              autoOk
              label="From Date"
              disableFuture
              value={fromDate}
              onChange={handleFromDateChange}
              format="dd/MM/yyyy"
              animateYearScrolling
              className="hpr-exe-service-fDate-txt-wrapper"
              InputProps={{
                endAdornment: <FontAwesomeIcon icon="calendar-alt" />,
              }}
            />
            <DatePicker
              autoOk
              label="To Date"
              disableFuture
              value={toDate}
              onChange={handleToDateChange}
              format="dd/MM/yyyy"
              animateYearScrolling
              className="hpr-exe-service-fDate-txt-wrapper"
              InputProps={{
                endAdornment: <FontAwesomeIcon icon="calendar-alt" />,
              }}
              inputVariant="outlined"
            />
          </MuiPickersUtilsProvider>

          <Button
            className="hpr-filter-sort-submit filter-go-btn hpr-pr-filter-go-btn"
            onClick={(e) => getAllCBReuestByDt(e)}
          >
            GO
          </Button>
        </div>
      </div>

      <div class="row">
        <div class="col-12">
          {/* {!!policiesList && (
            <PoliciesList
              flexTableArray={policiesList}
              data={viewDetailsData}
            />
          )} */}
          {!!getAllCBRequest && (
            <GetCBRequestList
              flexTableArray={getAllCBRequest}
              data={viewDetailsData}
            />
          )}
        </div>
      </div>
    </Fragment>
  );

  return exeGetAllCBRequestTemplate;
});

export default ExeGetAllCBRequest;
