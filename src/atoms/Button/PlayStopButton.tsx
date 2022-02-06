import React from 'react';
import { PlayStopIcon } from '../Icons';
import { ToggleButton } from './ToggleButton';

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
    <ToggleButton
      onClick={onClick}
      isActive={playing}
      popOver={playing ? '停止' : '再生'}
    >
      <PlayStopIcon playing={playing} />
    </ToggleButton>
  );
};
