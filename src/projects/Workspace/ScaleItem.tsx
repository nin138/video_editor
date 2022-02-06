import React from 'react';
import styles from './Scale.module.css';
import { classNames } from '../../util';

interface Props {
  sec: number;
  width: number;
}

export const ScaleItem: React.VFC<Props> = ({ width, sec }) => {
  return (
    <div className={styles.wrap} style={{ width }}>
      <div className={styles.time}>{sec}</div>
      <div className={classNames(styles.bar, styles.start)} />
      <div className={classNames(styles.bar, styles.quarter)} />
      <div className={classNames(styles.bar, styles.half)} />
      <div className={classNames(styles.bar, styles.quarter)} />
    </div>
  );
};
