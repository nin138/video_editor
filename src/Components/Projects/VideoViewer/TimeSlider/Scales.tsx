import React from 'react';
import styles from './Scales.module.css';
import { MARK_WIDTH, Step } from './TimeSlider';

interface Props {
  duration: number;
  width: number;
  step: Step;
}

const iToDisplayString = (i: number, step: Step) => {
  switch (step) {
    case Step.All:
      return i;
    case Step.Min:
      return i + 'm';
    case Step.TenSec:
      return i + '0s';
    case Step.Sec:
      return i + 's';
  }
};

export const Scales: React.FC<Props> = ({ width, step }) => {
  if (width === 0) return null;

  const count = Math.ceil(width / MARK_WIDTH);
  const items = [];
  for (let i = 0; i <= count; i++) {
    items.push(
      <div key={i} style={{ left: (i - 1) * MARK_WIDTH }} className={styles.line}>
        <div className={styles.time}>{iToDisplayString(i - 1, step)}</div>
      </div>
    );
  }

  return (
    <div className={styles.wrap} style={{ width: width }}>
      {items}
    </div>
  );
};
