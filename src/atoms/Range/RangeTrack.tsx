import React from 'react';
import styles from './Track.module.css';
import { ITrackProps } from 'react-range/lib/types';
import { getTrackBackground } from 'react-range';

const colors = ['#eee', '#aa1111', '#eee'];

interface Props {
  props: ITrackProps;
  values: [number, number];
  max: number;
}

export const RangeTrack: React.FC<Props> = ({
  values,
  max,
  props,
  children,
}) => (
  <div style={{ ...props.style }} className={styles.track}>
    <div
      onMouseDown={props.onMouseDown}
      onTouchStart={props.onTouchStart}
      ref={props.ref}
      style={{
        background: getTrackBackground({ values, colors, min: 0, max }),
      }}
      className={styles.trackBar}
    >
      {children}
    </div>
  </div>
);
