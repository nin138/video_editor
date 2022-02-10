import React from 'react';
import styles from './WsItem.module.css';

export interface WsVideoViewProps {
  name: string;
  color: string;
  width: number;
}

export const WsVideoView: React.VFC<WsVideoViewProps> = ({
  name,
  color,
  width,
}) => {
  return (
    <div
      className={styles.wsVideoView}
      style={{ background: color, width: width }}
    >
      {name}
    </div>
  );
};
