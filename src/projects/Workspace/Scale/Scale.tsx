import React, { ReactElement } from 'react';
import styles from '../Scale.module.css';
import { ScaleItem } from './ScaleItem';
import { getScaleConfig } from './calcScale';

interface Props {
  duration: number;
  pxPerSec: number;
}

export const Scale: React.FC<Props> = ({ duration, pxPerSec }) => {
  let items = [];
  let i = 0;

  console.log('render scale');

  const { width, display, ite } = getScaleConfig(duration, pxPerSec);

  while (i < ite) {
    items.push(<ScaleItem key={i} display={display(i)} width={width} />);
    i++;
  }
  return <div className={styles.container}>{items}</div>;
};
