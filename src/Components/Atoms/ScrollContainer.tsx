import React from 'react';
import { classNames } from '../../util';
import styles from './Std.module.css';

interface Props {
  className?: string;
  areaRef?: React.RefObject<HTMLDivElement>;
}

export const ScrollContainer: React.FC<Props> = ({ children, className, areaRef }) => {
  return (
    <div ref={areaRef} className={classNames(styles.scroll, className)}>
      {children}
    </div>
  );
};
