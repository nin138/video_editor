import { Range as RRange, useThumbOverlap } from 'react-range';
import React from 'react';
import styles from './Thumb.module.css';

export const ThumbLabel = ({
  rangeRef,
  values,
  index,
}: {
  rangeRef: RRange | null;
  values: number[];
  index: number;
}) => {
  const [labelValue, style] = useThumbOverlap(rangeRef, values, index);
  return (
    <div
      data-label={index}
      style={style as React.CSSProperties}
      className={styles.label}
    >
      {labelValue}
    </div>
  );
};
