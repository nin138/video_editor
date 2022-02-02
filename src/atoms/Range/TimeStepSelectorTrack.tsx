import React from 'react';
import { Direction, ITrackProps } from 'react-range/lib/types';
import { getTrackBackground } from 'react-range';

interface Props {
  props: ITrackProps;
  value: number;
  max: number;
}

export const TimeStepSelectorTrack: React.FC<Props> = ({
  value,
  max,
  props,
  children,
}) => (
  <div
    onMouseDown={props.onMouseDown}
    onTouchStart={props.onTouchStart}
    style={{
      ...props.style,
      flexGrow: 1,
      width: '36px',
      display: 'flex',
      height: '80px',
    }}
  >
    <div
      ref={props.ref}
      style={{
        width: '5px',
        height: '100%',
        borderRadius: '4px',
        background: getTrackBackground({
          values: [value],
          colors: ['#548BF4', '#ccc'],
          min: 0,
          max: max,
          direction: Direction.Down,
        }),
        alignSelf: 'center',
      }}
    >
      {children}
    </div>
  </div>
);
