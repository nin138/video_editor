import React from 'react';
import styles from './WsItem.module.css';
import { classNames } from '../../../../util';

export interface WsVideoViewProps {
  name: string;
  color: string;
  width: number;
  className?: string;
}

export const WsVideoView: React.VFC<WsVideoViewProps> = ({ name, color, width, className }) => {
  return (
    <div className={classNames(styles.wsVideoView, className)} style={{ background: color, width: width }}>
      {name}
    </div>
  );
};
