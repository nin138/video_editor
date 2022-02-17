import React from 'react';
import { Range as RRange } from 'react-range';
import { IThumbProps } from 'react-range/lib/types';
import { ThumbLabel } from './ThumbLabel';
import { RangeTrack } from './RangeTrack';
import { LabelLeft, LabelRight } from '../Icons';
import { IconButton } from '@mui/material';
import styles from './Thumb.module.css';

interface Props {
  max: number;
  onChange: (values: [number, number]) => void;
  values: [number, number];
}

interface ThumbProps {
  props: IThumbProps;
  value: number;
  values: number[];
  index: number;
  isDragged: boolean;
  range: RRange;
}

const Thumb: React.FC<ThumbProps> = ({ props, values, range, index }) => {
  return (
    <div {...props} style={props.style} className={styles.thumb}>
      <ThumbLabel rangeRef={range} values={values} index={index} />
      <IconButton className={styles.thumbIcon}>
        {index === 0 ? <LabelLeft className={styles.thumbIcon} /> : <LabelRight className={styles.thumbIcon} />}
      </IconButton>
    </div>
  );
};

export const Range: React.FC<Props> = ({ max, onChange, values }) => {
  const rangeRef: React.MutableRefObject<RRange | null> = React.useRef<RRange>(null);

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        flexWrap: 'wrap',
      }}
    >
      <RRange
        allowOverlap
        values={values}
        ref={rangeRef}
        step={0.1}
        min={0}
        max={max}
        onChange={onChange as (values: number[]) => void}
        renderTrack={({ props, children }) => (
          <RangeTrack values={values} max={max} props={props} children={children} />
        )}
        renderThumb={(props) => <Thumb key={props.props.key} {...props} range={rangeRef.current!} values={values} />}
      />
    </div>
  );
};
