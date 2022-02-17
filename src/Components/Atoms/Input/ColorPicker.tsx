import React from 'react';
import { TextField } from '@mui/material';
import styles from '../../Projects/Workspace/Modal/Modal.module.css';
import { HexColorPicker } from 'react-colorful';

interface Props {
  id: string;
  label?: string;
  color: string;
  error: boolean;
  onChange: (color: string) => void;
}

export const ColorPicker: React.VFC<Props> = ({ color, error, onChange, id, label }) => {
  return (
    <div className={styles.flexContainer}>
      <div className={styles.colorText}>
        <TextField
          error={error}
          id={id}
          label={label || 'color'}
          variant="outlined"
          value={color}
          onChange={(ev) => onChange(ev.target.value)}
        />
      </div>
      <HexColorPicker color={color} onChange={onChange} />
    </div>
  );
};
