import React, { ReactElement } from 'react';
import styles from './Scale.module.css';
import { ScaleItem } from './ScaleItem';

interface Props {
  duration: number;
  width: number;
}

export const Scale: React.FC<Props> = ({ width, duration }) => {
  let items = [];
  let i = 0;
  while (i < duration) {
    items.push(<ScaleItem key={i} sec={i} width={width} />);
    i++;
  }
  return <div className={styles.container}>{items}</div>;
};
