import React from 'react';
import styles from './Track.module.css';
import { ITrackProps } from 'react-range/lib/types';
import { getTrackBackground } from 'react-range';

const colors = ['#041562', '#eee'];

interface Props {
  props: ITrackProps;
  value: number;
  max: number;
}

export const SliderTrack: React.FC<Props> = ({ value, max, props, children }) => (
  <div
    onMouseDown={props.onMouseDown}
    onTouchStart={props.onTouchStart}
    style={{ ...props.style }}
    className={styles.track}
  >
    <div
      ref={props.ref}
      className={styles.trackBar}
      style={{
        background: getTrackBackground({
          values: [value],
          colors,
          min: 0,
          max,
        }),
      }}
    >
      {children}
    </div>
  </div>
);
