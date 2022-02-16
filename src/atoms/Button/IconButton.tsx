import React from 'react';
import styles from './Button.module.css';
import { ButtonBase } from '@mui/material';
import Popover from '@mui/material/Popover';
import popoverStyle from '../PopOver.module.css';

interface Props {
  onClick: () => void;
  disabled?: boolean;
  className?: string;
  popOver: string;
}

export const IconButton: React.FC<Props> = ({ children, onClick, disabled, className, popOver }) => {
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
      className={className}
      disabled={disabled}
      onClick={onClick}
      onMouseEnter={handlePopoverOpen}
      onMouseLeave={handlePopoverClose}
      TouchRippleProps={{ classes: { ripple: styles.ripple } }}
    >
      <div className={styles.button}>{children}</div>
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
        classes={{
          paper: popoverStyle.popOver,
        }}
        onClose={handlePopoverClose}
        disableRestoreFocus
      >
        <p className={popoverStyle.text}>{popOver}</p>
      </Popover>
    </ButtonBase>
  );
};
