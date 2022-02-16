import React from 'react';
import { Range as RRange } from 'react-range';
import styles from './Range.module.css';
import { SliderTrack } from './SliderTrack';
import { SliderThumb } from './SliderThumb';

interface Props {
  max: number;
  onChange: (value: number) => void;
  value: number;
}

export const Slider: React.FC<Props> = ({ value, onChange, max }) => {
  return (
    <div className={styles.wrap}>
      <RRange
        values={[value]}
        onChange={([value]) => onChange(value)}
        min={0}
        step={0.01}
        max={max}
        renderTrack={(props) => <SliderTrack max={max} value={value} {...props} />}
        renderThumb={SliderThumb}
      />
    </div>
  );
};
