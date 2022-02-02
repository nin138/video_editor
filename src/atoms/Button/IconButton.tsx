import React from 'react';
import styles from './Button.module.css';
import { ButtonBase } from '@mui/material';

interface Props {
  onClick: () => void;
  disabled?: boolean;
  className?: string;
}

export const IconButton: React.FC<Props> = ({
  children,
  onClick,
  disabled,
  className,
}) => {
  return (
    <ButtonBase
      className={className}
      disabled={disabled}
      onClick={onClick}
      TouchRippleProps={{ classes: { ripple: styles.ripple } }}
    >
      <div className={styles.button}>{children}</div>
    </ButtonBase>
  );
};
