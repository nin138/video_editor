import React, { createRef, useEffect, useRef, useState } from 'react';
import { Workspace } from '../../../../entities/workspace';
import { loop } from '../../../../loop';
import { WsVideoControl } from './WsVideoControl';
import styles from './WsPlayer.module.css';

const getTargetIndex = (workspace: Workspace, currentTime: number) => {
  return (
    workspace.videoItems.length - 1 - [...workspace.videoItems].reverse().findIndex((it) => it.startTime <= currentTime)
  );
};

interface Props {
  workspace: Workspace;
  onTimeUpdate: (time: number) => void;
}

const LOOP_ID = 'wsplayer';

const rmLoop = () => loop.remove(LOOP_ID);
const addLoop = (cb: () => void) => loop.add(LOOP_ID, cb);

export const WsPlayer: React.VFC<Props> = ({ workspace, onTimeUpdate }) => {
  const [currentTime, setCurrentTime] = useState(0);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    onTimeUpdate(currentTime);
  }, [currentTime, onTimeUpdate]);

  const videoRefs = useRef<React.RefObject<HTMLVideoElement>[]>([]);
  videoRefs.current = workspace.videoItems.map((_, i) => videoRefs.current[i] ?? createRef());

  const targetIndex = getTargetIndex(workspace, currentTime);
  const targetInfo = workspace.videoItems[targetIndex];
  const targetVideo = videoRefs.current[targetIndex]?.current;

  const onPlayClick = () => {
    if (!playing) {
      console.log(currentTime, workspace.duration, currentTime >= workspace.duration);
      if (currentTime >= workspace.duration) {
        console.log('c');
        setCurrentTime(0);
        videoRefs.current[0].current!.currentTime = 0;
        videoRefs.current[0].current?.play();
      } else {
        targetVideo?.play();
      }
    } else targetVideo?.pause();
    setPlaying(!playing);
  };

  const onEnded = () => {
    let t = targetIndex;
    if (targetIndex === workspace.videoItems.length - 1) {
      if (currentTime !== targetInfo.startTime) {
        setPlaying(false);
        return;
      }
      t -= 1;
    }
    const nextTarget = videoRefs.current[t + 1].current;
    if (!nextTarget) return;
    nextTarget.currentTime = 0;
    nextTarget.play();
    setCurrentTime(workspace.videoItems[t + 1].startTime);
  };

  const onSeek = (value: number) => {
    if (!targetVideo) return;
    const nextIndex = getTargetIndex(workspace, value);
    const target = videoRefs.current[nextIndex].current;
    target!.currentTime = value - workspace.videoItems[nextIndex].startTime;
    if (playing && target!.paused) target?.play();
    if (nextIndex !== targetIndex) targetVideo.pause();

    setCurrentTime(value as number);
  };

  const videoElements = workspace.videoItems.map((it, i) => {
    const isCurrent = i === targetIndex;
    return (
      <video
        key={i}
        ref={videoRefs.current[i]}
        muted
        className={styles.video}
        style={{
          opacity: isCurrent ? 1 : 0,
          width: 480,
          zIndex: isCurrent ? 1 : 0,
        }}
        onEnded={onEnded}
        controls
        src={it.url}
      />
    );
  });

  const everyTick = () => {
    if (!targetVideo) return;
    setCurrentTime(targetInfo.startTime + targetVideo.currentTime);
  };

  useEffect(() => {
    addLoop(everyTick);
    return () => rmLoop();
  }, [targetIndex, targetVideo]);

  return (
    <div>
      <div className={styles.videoArea}>{videoElements}</div>
      <WsVideoControl
        workspace={workspace}
        playing={playing}
        currentTime={currentTime}
        onSeek={onSeek}
        onPlayClick={onPlayClick}
      />
    </div>
  );
};
