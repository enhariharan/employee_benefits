import React, { Fragment, useContext, useState, useEffect } from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Paper from '@material-ui/core/Paper';

import {
  BrowserRouter as Router,
  Route,
  Redirect,
  Switch,
  Link,
  useHistory,
} from 'react-router-dom';

import Moment from 'react-moment';

import { camelCaseToSentenseText } from '../../../reUseComponents/utils/utils';

const ViewCommonDetails = React.memo((props) => {
  // console.log('ViewCommonDetails props ', props);
  const [headingsData, setHeadingsData] = useState({});
  const [tableData, setTableData] = useState({});
  const history = useHistory();

  useEffect(() => {
    setHeadingsData(props.location.state.headings);
    setTableData(props.location.state.tableData);
  }, []);

  const backTo = () => {
    !headingsData.isEmpDeps
      ? history.push(headingsData.detailsPath)
      : history.goBack();
    // history.goBack();
  };

  const ViewCommonDetailsTemplate = (
    <Fragment>
      {!!headingsData && !!tableData && (
        <Fragment>
          <div className="hpr_pageHeadingWrapper">
            <div className="hpr_page-heading-left-wrapper">
              <div className="hpr-breadcrumb-wrapper">
                <a style={{ cursor: 'pointer' }} onClick={backTo}>
                  <FontAwesomeIcon icon="chevron-left" className="mr-1" />
                  Back
                </a>
              </div>
              <h3 className="">
                {headingsData.pageHeading} of {headingsData.id}
              </h3>
            </div>
          </div>
          <div className="row">
            <div className="col-12">
              <Paper
                elevation={1}
                className="hpr-emp-pd-wrapper hpr-view-details-row-wrapper"
              >
                <div className="row">
                  {Object.keys(tableData).map((val) => {
                    return (
                      <Fragment>
                        {!!tableData[val] &&
                          !val.toLowerCase().includes('uuid') &&
                          tableData[val] !== '0' &&
                          tableData[val] !== '0.00' && (
                            <div className="col-4">
                              <div className="hpr-view-details-label-value-wrapper">
                                {val.toLocaleLowerCase() === 'fromdate' ||
                                val.toLocaleLowerCase() === 'todate' ||
                                val.toLocaleLowerCase() === 'dob' ||
                                val.toLocaleLowerCase() === 'updatedat' ||
                                val.toLocaleLowerCase() === 'createdat' ||
                                val.toLocaleLowerCase() === 'reportedat' ||
                                val.toLocaleLowerCase() === 'resolveddate' ||
                                val.toLocaleLowerCase() === 'dateofreport' ||
                                val.toLocaleLowerCase() === 'dateofjoining' ||
                                val.toLocaleLowerCase() === 'dateofexit' ||
                                val.toLocaleLowerCase() ===
                                  'callbackrequestedtime' ? (
                                  <Fragment>
                                    <div className="hrp-vd-label">
                                      {camelCaseToSentenseText(val)} :
                                    </div>
                                    <div className="hrp-vd-value">
                                      <Moment format="DD/MM/YYYY">{`${tableData[val]}`}</Moment>
                                    </div>
                                  </Fragment>
                                ) : val.toLocaleLowerCase() ===
                                  'linkedexecutives' ? (
                                  <Fragment>
                                    <div className="hrp-vd-label">
                                      {camelCaseToSentenseText(val)} :
                                    </div>
                                    <div className="hrp-vd-value">
                                      {tableData[val].map((val, index) => {
                                        return (
                                          <div>
                                            {val.firstName} {val.lastName}
                                          </div>
                                        );
                                      })}
                                    </div>
                                  </Fragment>
                                ) : (
                                  <Fragment>
                                    <div className="hrp-vd-label">
                                      {camelCaseToSentenseText(val)} :
                                    </div>
                                    <div className="hrp-vd-value">
                                      {`${tableData[val]}`}
                                    </div>
                                  </Fragment>
                                )}
                              </div>
                            </div>
                          )}
                      </Fragment>
                    );
                  })}
                </div>
              </Paper>
            </div>
          </div>
        </Fragment>
      )}
    </Fragment>
  );

  return ViewCommonDetailsTemplate;
});

export default ViewCommonDetails;
