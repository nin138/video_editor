import React from 'react';
import { IMarkProps } from 'react-range/lib/types';
import styles from './TimeStepSelectorMark.module.css';
import { Step } from '../../Projects/VideoViewer/TimeSlider/TimeSlider';

const stepToName = (step: Step): string => {
  switch (step) {
    case Step.All:
      return 'ALL';
    case Step.Min:
      return '1m';
    case Step.TenSec:
      return '10s';
    case Step.Sec:
      return '1s';
  }
};

interface Props {
  props: IMarkProps;
  index: number;
}

export const TimeStepSelectorMark: React.FC<Props> = ({ props, index }) => {
  return (
    <div {...props} className={styles.mark}>
      {stepToName(index)}
    </div>
  );
};
