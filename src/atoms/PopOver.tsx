import React, { useEffect } from 'react';
import Popover from '@mui/material/Popover';
import popoverStyle from './PopOver.module.css';

interface Props {
  targetRef: React.MutableRefObject<HTMLElement | undefined>;
}

export const PopOver: React.FC<Props> = ({ targetRef, children }) => {
  const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  useEffect(() => {
    if (!targetRef.current) return;
    const handlePopoverOpen = (event: MouseEvent) => {
      setAnchorEl(event.currentTarget as HTMLElement);
    };
    targetRef.current!.addEventListener('mouseenter', handlePopoverOpen);
    targetRef.current!.addEventListener('mouseleave', handlePopoverClose);

    return () => {
      if (!targetRef.current) return;
      targetRef.current.removeEventListener('mouseenter', handlePopoverOpen);
      targetRef.current.removeEventListener('mouseleave', handlePopoverClose);
    };
  }, [targetRef.current]);

  const open = Boolean(anchorEl);
  return (
    <Popover
      id="mouse-over-popover"
      sx={{
        pointerEvents: 'none',
      }}
      open={open}
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'center',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'center',
      }}
      classes={{
        paper: popoverStyle.popOver,
      }}
      onClose={handlePopoverClose}
      disableRestoreFocus
    >
      <div className={popoverStyle.text}>{children}</div>
    </Popover>
  );
};
