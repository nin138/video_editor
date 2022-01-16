import React from 'react';
import './ToggleButton.css';
import { classNames } from '../util';

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
    <button
      onClick={() => onClick(!isActive)}
      className={classNames('toggle', isActive ? 'toggle-active' : '')}
    >
      {children}
    </button>
  );
};
