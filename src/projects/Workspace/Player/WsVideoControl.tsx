import React from 'react';
import styles from './WsPlayer.module.css';
import { Slider } from '../../../atoms/Range/Slider';
import { PlayStopButton } from '../../../atoms/Button/PlayStopButton';
import { Workspace } from '../../../entities/workspace';

export interface WsVideoViewProps {
  workspace: Workspace;
  playing: boolean;
  currentTime: number;
  videoRef: React.MutableRefObject<HTMLVideoElement | null>;
  onSeek: (val: number) => void;
  setPlaying: (val: boolean) => void;
}

export const WsVideoControl: React.VFC<WsVideoViewProps> = ({
  setPlaying,
  workspace,
  playing,
  currentTime,
  videoRef,
  onSeek,
}) => {
  if (workspace.duration === 0) return null;

  const onPlayClick = () => {
    if (playing) videoRef.current?.pause();
    setPlaying(!playing);
  };

  return (
    <div>
      {workspace.duration !== 0 ? (
        <Slider
          max={workspace.duration}
          onChange={onSeek}
          value={currentTime}
        />
      ) : null}
      <div className={styles.controls}>
        <div className={styles.time}>
          {Math.floor(currentTime)}
          <span className={styles.timeSeparator}>/</span>
          {workspace.duration}
        </div>
        <PlayStopButton playing={playing} onClick={onPlayClick} />
      </div>
    </div>
  );
};
