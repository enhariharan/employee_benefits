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

import XLSX from 'xlsx';

import sampleBulkDepndents from '../../../../assets/images/sample-bulk-dependents.csv';

import { PubSub } from '../../../../services/PubSub';
import ApiService from '../../../../services/ApiService';
import { EMP_CONST } from '../../../../services/Constants';
import { GlobalDataContext } from '../../../../context/GlobalDataContext';

import update from 'immutability-helper';

import TextField from '@material-ui/core/TextField';
import { Button, Tooltip } from '@material-ui/core';
import MenuItem from '@material-ui/core/MenuItem';

import {
  CapitalizeFirstLetter,
  uniqueCorporateObject,
  sheetJSFT,
} from '../../../../reUseComponents/utils/utils';

import BulkDependentsUpload from '../../../commonPages/bulkDependentsUpload/BulkDependentsUpload';

const ExeBulkUploadDependents = React.memo((props) => {
  // console.log('ExeBulkUploadDependents props ', props);

  let isGlobalCorporateData;
  !!globalOnLoadData &&
  Object.keys(globalOnLoadData).length > 0 &&
  !!globalOnLoadData.corporatesData
    ? (isGlobalCorporateData = true)
    : (isGlobalCorporateData = false);

  const [globalOnLoadData, setGlobalOnLoadData] = useContext(GlobalDataContext);
  // console.log('ExeBulkUploadEmployee globalOnLoadData ', globalOnLoadData);

  const [corporateIdVal, setCorporateIdVal] = useState(
    (!!globalOnLoadData.selectedCorporate &&
      globalOnLoadData.selectedCorporate.companyName) ||
      ''
  );
  const [corporatesData, setCorporatesData] = useState(
    (!!isGlobalCorporateData && globalOnLoadData.corporatesData) || []
  );

  const [bulkDependentsData, setBulkDependentsData] = useState([]);

  const fileInput = React.createRef();

  const handleChangeBulk = (e) => {
    const files = e.target.files;
    if (files && files[0]) {
      handleFile(files[0]);
    }
  };

  const handleFile = (file) => {
    // console.log('file ', file);
    const reader = new FileReader();
    const rABS = !!reader.readAsBinaryString;
    reader.onload = ({ target: { result } }) => {
      const wb = XLSX.read(result, {
        type: rABS ? 'binary' : 'array',
        cellDates: true,
        cellNF: false,
        cellText: false,
      });
      const wsname = wb.SheetNames[0];
      const ws = wb.Sheets[wsname];
      const data = XLSX.utils.sheet_to_json(ws);
      setBulkDependentsData(data);
    };
    if (rABS) reader.readAsBinaryString(file);
    else reader.readAsArrayBuffer(file);
  };

  useEffect(() => {
    if (!!globalOnLoadData.pendingActionsData) {
      getAllCorporates();
    }
  }, [!!globalOnLoadData.pendingActionsData]);

  const getAllCorporates = () => {
    if (!!isGlobalCorporateData) {
      return;
    }
    ApiService.get(`${EMP_CONST.URL.exe_getCorporates}`)
      .then((response) => {
        // console.log('response getAllCorporates ', response);
        if (typeof response !== 'undefined') {
          let uniqueCorporateData = uniqueCorporateObject(response.data);
          setCorporatesData(uniqueCorporateData);
          const newCorporatesData = update(globalOnLoadData, {
            ['corporatesData']: {
              $set: uniqueCorporateData,
            },
          });
          setGlobalOnLoadData(newCorporatesData);
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

  const handleChangeCorporate = (e) => {
    if (!!e.target.value) {
      setCorporateIdVal(e.target.value);
      let currentObj = corporatesData.filter(
        (obj) => obj.companyName === e.target.value
      );

      const updateCorporate = update(globalOnLoadData, {
        selectedCorporate: {
          $set: currentObj[0],
        },
      });
      setGlobalOnLoadData(updateCorporate);
    }
  };

  const downloadSampleBulkDep = () => {
    window.open(sampleBulkDepndents, '_blank');
  };

  const exeBulkUploadDependentsTemplate = (
    <Fragment>
      <div className="hpr_pageHeadingWrapper">
        <div className="hpr_page-heading-left-wrapper">
          <div className="hpr-breadcrumb-wrapper">
            <Link to={'/executive-home/employees'}>
              <FontAwesomeIcon icon="chevron-left" className="mr-1" />
              Back
            </Link>
          </div>
          <h3 className="">Bulk Upload Dependents</h3>
        </div>

        <div className="hpr-flex-table-filter-sort-wrapper align-items-center employee-pending-filter-wrapper">
          <TextField
            id="corporateIdVal"
            label="Corporate"
            select
            type="text"
            value={corporateIdVal}
            onChange={handleChangeCorporate}
            size="small"
            className="status-select-wrapper mr-1"
            variant="outlined"
          >
            {corporatesData.map((obj) => (
              <MenuItem key={obj} value={obj.companyName}>
                {CapitalizeFirstLetter(obj.companyName)}
              </MenuItem>
            ))}
          </TextField>

          {!!globalOnLoadData.selectedCorporate &&
            !!globalOnLoadData.selectedCorporate.uuid && (
              <Fragment>
                <Button
                  onClick={() => fileInput.current.click()}
                  className="hpr-filter-sort-submit filter-go-btn ml-3"
                >
                  <FontAwesomeIcon icon="upload" className="mr-2" /> Upload CSV
                </Button>
                <input
                  ref={fileInput}
                  type="file"
                  hidden
                  accept={sheetJSFT}
                  onChange={handleChangeBulk}
                />
                {/* <Tooltip
                  title="Download Sample CSV"
                  className="hpr-help-wrapper"
                > */}
                <Button
                  className="hpr-download-template-wrapper"
                  onClick={downloadSampleBulkDep}
                >
                  <FontAwesomeIcon icon="download" className="mr-2" /> Download
                  Template
                </Button>
                {/* </Tooltip> */}
              </Fragment>
            )}
        </div>
      </div>
      <div className="row">
        <div className="col-12">
          <BulkDependentsUpload
            flexTableArray={bulkDependentsData}
            propObj={{
              redirectURL: '/executive-home/employees/list-employees',
              corporateUuid: !!globalOnLoadData.selectedCorporate
                ? globalOnLoadData.selectedCorporate.uuid
                : '',
            }}
          ></BulkDependentsUpload>
        </div>
      </div>
    </Fragment>
  );

  return exeBulkUploadDependentsTemplate;
});

export default ExeBulkUploadDependents;
