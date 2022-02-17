import React from 'react';
import { IThumbProps } from 'react-range/lib/types';
import styles from './Range.module.css';

export const SliderThumb: React.FC<{
  props: IThumbProps;
  value: number;
  index: number;
  isDragged: boolean;
}> = ({ props }) => {
  return <div {...props} className={styles.sliderThumb} style={props.style} />;
};
