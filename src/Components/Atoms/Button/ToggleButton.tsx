import React from 'react';
import styles from './Button.module.css';
import { classNames } from '../../../util';
import { ButtonBase } from '@mui/material';
import Popover from '@mui/material/Popover';
import { Option } from '../Option';
import popoverStyle from '../PopOver.module.css';

interface Props {
  children: React.ReactNode;
  onClick: (nextState: boolean) => void;
  isActive: boolean;
  popOver?: string;
}

export const ToggleButton: React.FC<Props> = ({ children, onClick, isActive, popOver }) => {
  const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);

  const handlePopoverOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };
  const open = Boolean(anchorEl);
  return (
    <ButtonBase
      onMouseEnter={handlePopoverOpen}
      onMouseLeave={handlePopoverClose}
      TouchRippleProps={{ classes: { ripple: styles.ripple } }}
      onClick={() => onClick(!isActive)}
    >
      <div className={classNames(styles.button, isActive ? styles.toggleActive : '')}>{children}</div>
      <Option display={popOver !== undefined}>
        <Popover
          id="mouse-over-popover"
          sx={{
            pointerEvents: 'none',
          }}
          open={open}
          anchorEl={anchorEl}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'left',
          }}
          onClose={handlePopoverClose}
          disableRestoreFocus
          classes={{
            paper: popoverStyle.popOver,
          }}
        >
          <p className={popoverStyle.text}>{popOver}</p>
        </Popover>
      </Option>
    </ButtonBase>
  );
};
