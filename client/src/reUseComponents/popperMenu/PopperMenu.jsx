import React, { Fragment } from 'react';

import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Grow from '@material-ui/core/Grow';
import Paper from '@material-ui/core/Paper';
import Popper from '@material-ui/core/Popper';
import MenuList from '@material-ui/core/MenuList';

import './popperMenu.scss';

const PopperMenu = React.memo(function PopperMenu(props) {
  // console.log('props PopperMenu ', props);

  const handleListKeyDown = (event) => {
    if (event.key === 'Tab') {
      event.preventDefault();
      // setOpen(false);
    }
  };

  const popperMenuTemplate = (
    <Popper
      open={props.isOpenPop}
      anchorEl={props.anchorRef}
      style={{ minWidth: props.minWidth }}
      transition
      disablePortal
      placement={props.placement}
    >
      {({ TransitionProps }) => (
        <Grow {...TransitionProps}>
          <Paper>
            <ClickAwayListener
              onClickAway={(e) => props.poppoverClick(e, props.currentIndex)}
            >
              <MenuList
                autoFocusItem={props.isOpenPop}
                id="menu-list-grow"
                onKeyDown={handleListKeyDown}
              >
                {props.menuListTemp}
              </MenuList>
            </ClickAwayListener>
          </Paper>
        </Grow>
      )}
    </Popper>
  );

  return popperMenuTemplate;
});

export default PopperMenu;
