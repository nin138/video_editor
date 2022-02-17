import React from 'react';
import styles from './Range.module.css';
import { Direction, Range as RRange } from 'react-range';
import { SliderThumb } from './SliderThumb';
import { Step } from '../../Projects/VideoViewer/TimeSlider/TimeSlider';
import { TimeStepSelectorTrack } from './TimeStepSelectorTrack';
import { TimeStepSelectorMark } from './TimeStepSelectorMark';

interface Props {
  onChange: (value: Step) => void;
  step: Step;
}

const MAX = 3;

export const TimeStepSelector: React.FC<Props> = ({ step, onChange }) => {
  return (
    <div className={styles.wrap}>
      <RRange
        direction={Direction.Down}
        values={[step]}
        onChange={([value]) => onChange(value)}
        min={0}
        max={MAX}
        step={1}
        renderTrack={(props) => <TimeStepSelectorTrack max={MAX} value={step} {...props} />}
        renderThumb={SliderThumb}
        renderMark={TimeStepSelectorMark}
      />
    </div>
  );
};
