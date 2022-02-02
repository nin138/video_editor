import React from 'react';
import styles from './Button.module.css';
import { classNames } from '../../util';
import { ButtonBase } from '@mui/material';
import { PlayStopIcon } from '../Icons';

interface Props {
  playing: boolean;
  videoRef: HTMLVideoElement;
}

export const PlayStopButton: React.FC<Props> = ({ videoRef, playing }) => {
  const onClick = () => {
    if (playing) videoRef.pause();
    else videoRef.play();
  };

  return (
    <ButtonBase
      TouchRippleProps={{ classes: { ripple: styles.ripple } }}
      onClick={onClick}
    >
      <div
        className={classNames(
          styles.button,
          playing ? styles.toggleActive : ''
        )}
      >
        <PlayStopIcon playing={playing} />
      </div>
    </ButtonBase>
  );
};
