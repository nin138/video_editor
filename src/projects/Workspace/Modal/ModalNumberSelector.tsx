import React from 'react';
import styles from './Modal.module.css';
import { Typography } from '@mui/material';
import Slider from '@mui/material/Slider';

interface Props {
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  step: number;
  label: string;
}

export const ModalNumberSelector: React.VFC<Props> = ({ label, max, min, step, value, onChange }) => {
  return (
    <div className={styles.modalInputArea}>
      {label}
      <div className={styles.modalSliderWrap}>
        <Typography className={styles.dataText}>{value}</Typography>
        <Slider min={min} max={max} step={step} value={value} onChange={(event, value) => onChange(value as number)} />
      </div>
    </div>
  );
};
