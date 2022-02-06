import React from 'react';
import styles from '../WsItem.module.css';

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
    <div style={{ height: '20px', background: color, width: width }}>
      {name}
    </div>
  );
};
