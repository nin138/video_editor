import React from 'react';
import styles from './Button.module.css';
import { classNames } from '../../util';
import { ButtonBase } from '@mui/material';

interface Props {
  children: React.ReactNode;
  onClick: (nextState: boolean) => void;
  isActive: boolean;
}

export const ToggleButton: React.FC<Props> = ({
  children,
  onClick,
  isActive,
}) => {
  return (
    <ButtonBase
      TouchRippleProps={{ classes: { ripple: styles.ripple } }}
      onClick={() => onClick(!isActive)}
    >
      <div
        className={classNames(
          styles.button,
          isActive ? styles.toggleActive : ''
        )}
      >
        {children}
      </div>
    </ButtonBase>
  );
};
