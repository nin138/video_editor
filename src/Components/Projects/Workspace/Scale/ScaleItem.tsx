import React from 'react';
import styles from '../Scale.module.css';
import { classNames } from '../../../../util';

interface Props {
  display: string;
  width: number;
}

export const ScaleItem: React.VFC<Props> = ({ width, display }) => {
  return (
    <div className={styles.wrap} style={{ width }}>
      <div className={styles.time}>{display}</div>
      <div className={classNames(styles.bar, styles.start)} />
      <div className={classNames(styles.bar, styles.quarter)} />
      <div className={classNames(styles.bar, styles.half)} />
      <div className={classNames(styles.bar, styles.quarter)} />
    </div>
  );
};
