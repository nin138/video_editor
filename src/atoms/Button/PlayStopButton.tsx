import React from 'react';
import { PlayStopIcon } from '../Icons';
import { ToggleButton } from './ToggleButton';

interface Props {
  playing: boolean;
  onClick: () => void;
}

export const PlayStopButton: React.FC<Props> = ({ playing, onClick }) => {
  return (
    <ToggleButton onClick={onClick} isActive={playing} popOver={playing ? '停止' : '再生'}>
      <PlayStopIcon playing={playing} />
    </ToggleButton>
  );
};
