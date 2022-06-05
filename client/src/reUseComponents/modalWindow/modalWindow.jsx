import React, { Fragment } from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

import { Button } from '@material-ui/core';

import Slide from '@material-ui/core/Slide';

import './modalWindow.scss';

// For Slide Modal Window
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="down" ref={ref} {...props} />;
});

const ModalWindow = React.memo(function ModalWindow(props) {
  // console.log('props modal window ', props);
  const dataModel = props.dataModel;
  return (
    !!props.modalOpen && (
      <div>
        <Dialog
          disableBackdropClick
          disableEscapeKeyDown
          fullScreen={props.fullScreen}
          open={props.modalOpen}
          TransitionComponent={Transition}
          onClose={props.handleClose}
          aria-labelledby="responsive-dialog-title"
        >
          <DialogTitle
            id="responsive-dialog-title"
            className={`dialogTitle ${
              !!props.dataModel.titleClass ? props.dataModel.titleClass : null
            }`}
          >
            {dataModel.title}
          </DialogTitle>
          <DialogContent>
            <DialogContentText
              dangerouslySetInnerHTML={{
                __html: dataModel.description,
              }}
            ></DialogContentText>
          </DialogContent>
          <DialogActions>
            {/* Secondary Button Area */}
            {!!dataModel.secondaryBtnTxt && (
              <Button
                variant="outlined"
                className=""
                onClick={props.closeModal}
              >
                {dataModel.secondaryBtnTxt}
              </Button>
            )}
            {/* Primary Button Area */}
            {!!dataModel.primaryBtnTxt && (
              <Button
                variant="outlined"
                className="modal-primary-btn"
                onClick={props.submitModal}
              >
                {dataModel.primaryBtnTxt}
              </Button>
            )}
          </DialogActions>
        </Dialog>
      </div>
    )
  );
});

export default ModalWindow;
