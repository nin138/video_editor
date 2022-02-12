import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Workspace, WsVideoItem } from '../../../entities/workspace';
import { useCombinedRefs } from '../../../util';
import { loop } from '../../../loop';
import { WsVideoControl } from './WsVideoControl';
import styles from './WsPlayer.module.css';

const isCurrentVideo = (video: WsVideoItem, currentTime: number) => {
  return (
    currentTime >= video.startTime &&
    currentTime <= video.startTime + video.duration
  );
};

interface Props {
  workspace: Workspace;
}

const LOOP_ID = 'wsplayer';

const rmLoop = () => loop.remove(LOOP_ID);
const addLoop = (cb: () => void) => loop.add(LOOP_ID, cb);

export const WsPlayer: React.VFC<Props> = ({ workspace }) => {
  const [currentTime, setCurrentTime] = useState(0);
  const [playing, setPlaying] = useState(true);

  const targetVideo = workspace.videoItems.find(isCurrentVideo);

  const videoRef = useRef<HTMLVideoElement>(null);
  const cbRef = useCallback<(node: HTMLVideoElement) => void>(
    (node) => {
      if (!node || !targetVideo) return;
      console.log('cb', targetVideo);
      node.currentTime = currentTime - targetVideo!.startTime;
      if (playing) node.play();
      else node.pause();
      const listener = () => {
        if (!node) {
          rmLoop();
          return;
        }
        setCurrentTime(
          targetVideo!.startTime + parseFloat(node.currentTime.toFixed(2))
        );
      };
      rmLoop();
      // if(playing) addLoop(listener);
      addLoop(listener);
    },
    [playing, targetVideo]
  );

  const ref = useCombinedRefs(cbRef, videoRef);

  const onEnded = () => {
    if (currentTime === workspace.duration) return;
    rmLoop();
    const next = targetVideo!.startTime + targetVideo!.duration;
    console.log(next);
    if (next === workspace.duration) {
      console.log(next);
      console.log('ended');
      setPlaying(false);
    }
    setCurrentTime(next);
  };

  const onSeek = (value: number) => {
    console.log('seek', targetVideo);
    if (!videoRef.current || !targetVideo) return;
    if (!isCurrentVideo(targetVideo, value)) {
      rmLoop();
      videoRef.current.pause();
    }
    setCurrentTime(value as number);
    videoRef.current.currentTime = value - targetVideo.startTime;
  };

  const videoElements = workspace.videoItems.map((it) => {
    const isCurrent = isCurrentVideo(it, currentTime);
    return (
      <video
        key={it.video.id}
        ref={isCurrent ? ref : undefined}
        muted
        className={styles.video}
        style={{
          opacity: isCurrent ? 1 : 1,
          width: 480,
          zIndex: isCurrent ? 1 : 0,
        }}
        onEnded={onEnded}
        controls
        src={it.url}
      />
    );
  });

  if (videoRef.current && playing) videoRef.current.play();

  useEffect(() => () => rmLoop(), []);

  return (
    <div>
      <div className={styles.videoArea}>{videoElements}</div>
      <button onClick={() => setCurrentTime(0)}>r</button>
      <WsVideoControl
        workspace={workspace}
        playing={playing}
        currentTime={currentTime}
        videoRef={videoRef}
        onSeek={onSeek}
        setPlaying={setPlaying}
      />
    </div>
  );
};
