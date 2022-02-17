import React from 'react';
import styles from './WsPlayer.module.css';
import { Slider } from '../../../Atoms/Range/Slider';
import { PlayStopButton } from '../../../Atoms/Button/PlayStopButton';
import { Workspace } from '../../../../entities/workspace';
import { formatSec } from '../../../../util';

export interface WsVideoViewProps {
  workspace: Workspace;
  playing: boolean;
  currentTime: number;
  onSeek: (val: number) => void;
  onPlayClick: () => void;
}

export const WsVideoControl: React.VFC<WsVideoViewProps> = ({
  onPlayClick,
  workspace,
  playing,
  currentTime,
  onSeek,
}) => {
  if (workspace.duration === 0) return null;

  return (
    <div>
      {workspace.duration !== 0 ? <Slider max={workspace.duration} onChange={onSeek} value={currentTime} /> : null}
      <div className={styles.controls}>
        <div className={styles.time}>
          {formatSec(Math.floor(currentTime))}
          <span className={styles.timeSeparator}>/</span>
          {formatSec(workspace.duration)}
        </div>
        <PlayStopButton playing={playing} onClick={onPlayClick} />
      </div>
    </div>
  );
};
