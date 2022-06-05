import React, {
  Fragment,
  useContext,
  useState,
  useEffect,
  useRef,
} from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import Moment from 'react-moment';
import MomentReg from 'moment';
import DateFnsUtils from '@date-io/date-fns';

import { EMP_CONST } from '../../../services/Constants';
import ApiService from '../../../services/ApiService';
import { PubSub } from '../../../services/PubSub';

import { Button } from '@material-ui/core';

import NoRecords from '../../../reUseComponents/noRecords/NoRecords';
import ModalWindow from '../../../reUseComponents/modalWindow/modalWindow.jsx';
import {
  isValidEmail,
  isValidDate,
  isValidMobile,
} from '../../../reUseComponents/utils/utils';

import {
  BrowserRouter as Router,
  Route,
  Redirect,
  Switch,
  Link,
  useHistory,
} from 'react-router-dom';

const BulkEmployeeUpload = React.memo((props) => {
  // console.log('BulkEmployeeUpload props ', props);
  const history = useHistory();
  const [validEntriesForBulkData, setValidEntriesForBulkData] = React.useState(
    []
  );
  const [isConfirmBulkUpload, setIsConfirmBulkUpload] = React.useState(false);
  const [notValidEmpCount, setNotValidEmpCount] = React.useState('');
  const [isNotValidAllEntries, setIsNotValidAllEntries] = React.useState(false);

  const closeNotValidAllEntriesmModel = (e) => {
    setIsNotValidAllEntries(false);
  };

  const listenNotValidAllEntriesModel = (e) => {};

  const closeConfirmModel = (e) => {
    setIsConfirmBulkUpload(false);
  };

  const submitValidBulkEmpData = () => {
    uploadBulkEmployeeCB(validEntriesForBulkData);
  };
  const listenConfirmModel = (e) => {};

  const uploadBulkEmployee = () => {
    let validEntries = props.flexTableArray.filter((obj) => {
      return (
        !!obj['empid'] &&
        !!obj['firstName'] &&
        !!obj['lastName'] &&
        !!obj['gender'] &&
        !!obj['email'] &&
        isValidEmail(obj['email']) &&
        !!obj['mobile'] &&
        !!obj['sumInsured'] &&
        parseFloat(obj['sumInsured']) == obj['sumInsured'] &&
        isValidMobile(obj['mobile']) &&
        !!obj['dob'] &&
        MomentReg(obj['dob'], 'DD/MM/YYYY').isValid()
      );
    });

    // console.log('validEntries ', validEntries);

    setValidEntriesForBulkData(validEntries);

    if (!!validEntries && validEntries.length === 0) {
      setIsNotValidAllEntries(true);
    }

    if (
      !!validEntries &&
      validEntries.length > 0 &&
      props.flexTableArray.length > validEntries.length
    ) {
      // Opening Confirm Box
      setIsConfirmBulkUpload(true);
      setNotValidEmpCount(props.flexTableArray.length - validEntries.length);
    }

    if (props.flexTableArray.length === validEntries.length) {
      uploadBulkEmployeeCB(validEntries);
    }
  };

  const changeDtToISO = (data) => {
    let newArray = data.map((obj) => {
      let dateFormateCheck = MomentReg(obj.dob, 'DD/MM/YYYY').format(
        'DD/MM/YYYY'
      );
      if (dateFormateCheck === 'Invalid date') {
        return;
      }
      let splitDt = dateFormateCheck.split('/');
      let newDt = new Date(
        parseInt(splitDt[2]),
        parseInt(splitDt[1]) - 1,
        parseInt(splitDt[0])
      );
      // obj.dob = MomentReg(newDt).toISOString();
      obj.dob = MomentReg(newDt).format('DD/MM/YYYY');
      obj.corporateUuid = props.propObj.corporateUuid; // Adding corporate uuid to array of employee objects
      if (!!obj.dateOfJoining) {
        obj.dateOfJoining = MomentReg(obj.dateOfJoining, 'DD/MM/YYYY').format(
          'YYYY-MM-DDTHH:mm:ss.SSS[Z]'
        );
      }
      return obj;
    });
    return newArray;
  };

  const uploadBulkEmployeeCB = (validEntries) => {
    // debugger;
    let modifiedDateFormatArray = changeDtToISO(validEntries);
    // console.log('modifiedDateFormatArray ', modifiedDateFormatArray);

    if (!!modifiedDateFormatArray && modifiedDateFormatArray.length === 0) {
      return;
    }
    ApiService.post(
      `${EMP_CONST.URL.exe_createCustomers}`,
      modifiedDateFormatArray
    )
      .then((response) => {
        // console.log('response uploadBulkEmployee ', response);
        if (
          typeof response !== 'undefined' &&
          response.errCode.toLowerCase() === 'success'
        ) {
          history.push({
            pathname: props.propObj.redirectURL,
            bulkUploadObj: { isDependant: false },
          });

          let respNotiObj = {
            // message: 'Employees Added successfully',
            message: response.message,
            color: 'success',
          };
          PubSub.publish(PubSub.events.SNACKBAR_PROVIDER, respNotiObj);
        }
      })
      .catch((err) => {
        console.log(`Resend Error ${JSON.stringify(err)} `);

        if (!!err.data.message || !!err.data.errCode) {
          let respNotiObj = {
            message: err.data.message || err.data.errCode,
            color: 'error',
          };
          PubSub.publish(PubSub.events.SNACKBAR_PROVIDER, respNotiObj);
        }
      })
      .finally(() => {
        console.log(`Finally `);
        if (!!isConfirmBulkUpload) {
          setIsConfirmBulkUpload(false);
        }
      });
  };

  const bulkEmployeeUploadTemplate = (
    <Fragment>
      {/* <pre>{JSON.stringify(validEntriesForBulkData, null, 1)}</pre> */}
      <div class="hpr-flex-table hpr-flex-table--collapse">
        <div class="hpr-flex-table-row hpr-flex-table-row--head">
          <div
            style={{ width: '15%' }}
            class="hpr-flex-table-cell hpr-flex-table-column-heading"
          >
            Employee Id
          </div>
          <div
            style={{ width: '15%' }}
            class="hpr-flex-table-cell hpr-flex-table-column-heading"
          >
            First Name
          </div>
          <div
            style={{ width: '10%' }}
            class="hpr-flex-table-cell hpr-flex-table-column-heading"
          >
            Last Name
          </div>
          <div
            style={{ width: '10%' }}
            class="hpr-flex-table-cell hpr-flex-table-column-heading"
          >
            Gender
          </div>
          <div
            style={{ width: '10%' }}
            class="hpr-flex-table-cell hpr-flex-table-column-heading"
          >
            DOB
          </div>
          <div
            style={{ width: '20%' }}
            class="hpr-flex-table-cell hpr-flex-table-column-heading"
          >
            Email
          </div>

          <div
            style={{ width: '20%' }}
            class="hpr-flex-table-cell hpr-flex-table-column-heading"
          >
            Mobile
          </div>
        </div>

        {props.flexTableArray.length == 0 && <NoRecords></NoRecords>}

        {props.flexTableArray.length > 0 &&
          props.flexTableArray.map((val, index) => (
            <div class="hpr-flex-table-row">
              <div
                style={{ width: '15%' }}
                class="hpr-flex-table-cell hpr-flex-table-topic-cell"
              >
                <div class="hpr-flex-table-cell--content date-content">
                  <span class="webinar-date">{val.empid}</span>
                </div>
              </div>
              <div style={{ width: '15%' }} class="hpr-flex-table-cell">
                <div class="hpr-flex-table-cell--heading">First Name</div>
                <div class="hpr-flex-table-cell--content title-content">
                  {val.firstName}
                </div>
              </div>

              <div style={{ width: '10%' }} class="hpr-flex-table-cell">
                <div class="hpr-flex-table-cell--heading">Last Name</div>
                <div class="hpr-flex-table-cell--content title-content">
                  {val.lastName}
                </div>
              </div>
              <div style={{ width: '10%' }} class="hpr-flex-table-cell">
                <div class="hpr-flex-table-cell--heading">Gender</div>
                <div class="hpr-flex-table-cell--content title-content">
                  {val.gender}
                </div>
              </div>

              <div style={{ width: '10%' }} class="hpr-flex-table-cell">
                <div class="hpr-flex-table-cell--heading">DOB</div>
                <div class="hpr-flex-table-cell--content access-link-content">
                  {MomentReg(val.dob, 'DD/MM/YYYY').format('DD/MM/YYYY')}
                </div>
              </div>
              <div style={{ width: '20%' }} class="hpr-flex-table-cell">
                <div class="hpr-flex-table-cell--heading">Email</div>
                <div class="hpr-flex-table-cell--content replay-link-content">
                  {val.email}
                </div>
              </div>

              <div style={{ width: '20%' }} class="hpr-flex-table-cell">
                <div class="hpr-flex-table-cell--heading">Mobile</div>
                <div class="hpr-flex-table-cell--content replay-link-content">
                  {val.mobile}
                </div>
              </div>
            </div>
          ))}
      </div>
      {props.flexTableArray.length > 0 && !!props.propObj.corporateUuid && (
        <div className="row">
          <div className="col-12 hpr-btns-wrapper text-center">
            <Button onClick={uploadBulkEmployee} className="hpr-primary-btn">
              <FontAwesomeIcon icon="upload" className="mr-2" /> Upload
              Employees
            </Button>
          </div>
        </div>
      )}

      {!!isConfirmBulkUpload && (
        <ModalWindow
          dataModel={{
            title: 'Are you sure?',
            description: `<span class='modal-description'><b class="bold-txt-desc">${notValidEmpCount} ${' &nbsp;'}</b> invalid entries are found. Do you still want to go ahead and submit ?</span>`,
            primaryBtnTxt: 'Yes',
            secondaryBtnTxt: 'No',
          }}
          closeModal={closeConfirmModel}
          submitModal={(e) =>
            submitValidBulkEmpData(e, EMP_CONST.ADDITION_STATUS[1])
          }
          modalOpen={isConfirmBulkUpload}
          handleResponse={listenConfirmModel}
        />
      )}

      {!!isNotValidAllEntries && (
        <ModalWindow
          dataModel={{
            title: 'Error Message',
            description: `<span class='modal-description'>"Invalid data. Either data is missing or is invalid Please correct and re-submit.</span>`,
            primaryBtnTxt: 'OK',
          }}
          closeModal={closeNotValidAllEntriesmModel}
          submitModal={(e) => closeNotValidAllEntriesmModel(e)}
          modalOpen={isNotValidAllEntries}
          handleResponse={listenNotValidAllEntriesModel}
        />
      )}
    </Fragment>
  );

  return bulkEmployeeUploadTemplate;
});

export default BulkEmployeeUpload;
