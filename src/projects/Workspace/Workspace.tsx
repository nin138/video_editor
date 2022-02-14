import React, { useContext, useRef, useState } from 'react';
import styles from './Workspace.module.css';
import { Scale } from './Scale/Scale';
import { ClipVideo } from '../../entities/video';
import { classNames, getResource } from '../../util';
import { useElementRect } from '../../hooks/useElementRect';
import { CustomDragLayer } from './Draggable/CustomDragLayer';
import { Workspace } from '../../entities/workspace';
import { getFFmpeg } from '../../ffmpeg/ffmpeg';
import { getOutputFileName } from '../../ffmpeg/getFileName';
import { ClipContext } from '../../context/ClipsContext';
import { Slider } from '@mui/material';
import { WorkspaceActionDispatcher } from '../../context/workspace/WorkspaceAction';
import { WsPlayer } from './Player/WsPlayer';
import { VideoLine } from './VideoLine';
import { calcTransform } from './translate';

const SNAP = true;

interface Props {
  workspace: Workspace;
  wsDispatcher: WorkspaceActionDispatcher;
}

const SCROLL_LEFT_WIDTH = 250;

export const WorkSpace: React.VFC<Props> = ({ workspace, wsDispatcher }) => {
  const videoItems = workspace.videoItems;

  const areaRef = useRef<HTMLDivElement>(null);
  const scrollRect = useElementRect(areaRef);

  // const pxPerSec = (duration === 0 || (scrollRect?.width || 0) === 0) ? 30 : ((scrollRect?.width || 200) - SCROLL_LEFT_WIDTH) / (duration + 1);

  const [pxPerSec, setPxPerSec] = useState(30);
  const [concatenating, setConcatenating] = useState(false);
  const { addClip } = useContext(ClipContext);
  const concatFiles = async () => {
    setConcatenating(true);
    const list = Array.from(videoItems);

    const paths = await Promise.all(
      list.sort((a, b) => a.startTime - b.startTime).map((it) => getResource(it.video.getPath()))
    );

    const ffmpeg = await getFFmpeg();

    const output = getOutputFileName.next().value;
    await ffmpeg.concatVideos(output, ...paths);

    addClip(new ClipVideo(output));
    setConcatenating(false);
  };

  const timeIndicator = useRef<HTMLDivElement>(null);

  const onTimeUpdate = (time: number) => {
    if (!timeIndicator.current) return;
    timeIndicator.current.style.transform = calcTransform(time, pxPerSec);
  };

  return (
    <div className={styles.wrap}>
      <WsPlayer workspace={workspace} onTimeUpdate={onTimeUpdate} />
      <Slider onChange={(_, value) => setPxPerSec(value as number)} value={pxPerSec} min={1} max={100} />
      <div className={classNames(styles.scroll, '.scroll')} ref={areaRef}>
        <div className={styles.scrollLeft}>
          <div>scale</div>
          <div>video</div>
        </div>
        <div className={styles.scrollInner}>
          <Scale duration={workspace.duration} pxPerSec={pxPerSec} />
          <VideoLine workspace={workspace} wsDispatcher={wsDispatcher} pxPerSec={pxPerSec} />
          <div className={styles.timeIndicator} ref={timeIndicator}>
            <div className={styles.triangle} />
          </div>
          <CustomDragLayer />
        </div>
      </div>

      {!concatenating ? (
        <button disabled={videoItems.length < 2} onClick={concatFiles}>
          処理開始
        </button>
      ) : (
        '処理中'
      )}
    </div>
  );
};
