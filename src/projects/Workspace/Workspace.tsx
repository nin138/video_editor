import React, { useContext, useRef, useState } from 'react';
import { useDrop } from 'react-dnd';
import { DragItemType, WsVideoDroppable } from './workspaceDraggable';
import { WorkSpaceItem } from './WorkspaceItem';
import styles from './Workspace.module.css';
import { Scale } from './Scale/Scale';
import { WsDraggableVideo } from './Draggable/WsDraggableVideo';
import { ClipVideo, Video } from '../../entities/video';
import { getResource, useCombinedRefs } from '../../util';
import { useElementRect } from '../../hooks/useElementRect';
import { CustomDragLayer } from './CustomDragLayer';
import { Workspace, WsVideoItem } from '../../entities/workspace';
import { swapPosition } from './Draggable/swapItemPosition';
import { getFFmpeg } from '../../ffmpeg/ffmpeg';
import { getOutputFileName } from '../../ffmpeg/getFileName';
import { ClipContext } from '../../context/ClipsContext';
import { Slider } from '@mui/material';
import { WorkspaceActionDispatcher } from '../../context/workspace/WorkspaceAction';
import { WsPlayer } from './Player/WsPlayer';

const ditems: WsVideoItem[] = [
  {
    video: {
      type: 'Video',
      getUrl: () => '',
      fileName: () => 'assss',
      getPath: () => '',
      getDuration: () => 4,
      id: '1',
    },
    startTime: 0,
    duration: 4,
    url: 'hoge',
  },
  {
    video: {
      type: 'Video',
      getUrl: () => '',
      fileName: () => 'afehj',
      getPath: () => '',
      getDuration: () => 8,
      id: '2',
    },
    startTime: 5,
    duration: 8,
    url: 'hoge',
  },
  {
    video: {
      type: 'Video',
      getUrl: () => '',
      fileName: () => 'ytujhty',
      getPath: () => '',
      getDuration: () => 5,
      id: '3',
    },
    startTime: 12,
    duration: 5,
    url: 'hoge',
  },
];

const COLORS = ['#f00', '#0f0', '#00f', '#ff0', '#f0f', '#0ff'];

const getColor = (i: number): string => {
  return COLORS[i % COLORS.length];
};

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

  // const OneSecWidth = (duration === 0 || (scrollRect?.width || 0) === 0) ? 30 : ((scrollRect?.width || 200) - SCROLL_LEFT_WIDTH) / (duration + 1);

  const [OneSecWidth, setOneSecWidth] = useState(30);

  const addItem = (video: Video) => {
    wsDispatcher.addVideoToWs(workspace.id, video);
  };

  const updateItems = (...newItems: WsVideoItem[]) => {
    wsDispatcher.updateWorkspace(workspace.id, (workspace) => ({
      ...workspace,
      videoItems: workspace.videoItems.map(
        (it) =>
          newItems.find((newItem) => newItem.video.id === it.video.id) || it
      ),
    }));
  };

  const videoAreaRef = useRef<HTMLDivElement>();

  const rect = useElementRect(videoAreaRef);

  const [, drop] = useDrop<
    WsVideoDroppable & { initialX: number },
    unknown,
    unknown
  >(
    () => ({
      accept: [DragItemType.Video, DragItemType.WorkspaceVideo],
      drop: (item, monitor) => {
        const x = monitor.getClientOffset()?.x;
        const w = rect?.left || 0;
        console.log(x);
        if (!x) return;

        if (item.type === DragItemType.Video) {
          addItem(item.video);
        } else if (item.type === DragItemType.WorkspaceVideo) {
          return; // TODO when not snap
        }
      },
    }),
    [workspace.videoItems, workspace.id]
  );

  const onHover = (draggingIndex: number, overedIndex: number) => {
    if (draggingIndex === overedIndex) return;
    const dragging = videoItems[draggingIndex];
    const target = videoItems[overedIndex];
    const [i1, i2] = swapPosition(dragging, target);
    updateItems(i1, i2);
  };

  const removeVideo = (video: Video) => {
    return () => wsDispatcher.removeVideoFromWs(workspace.id, video);
  };

  const ref = useCombinedRefs<any>(drop, videoAreaRef);

  const [concatenating, setConcatenating] = useState(false);
  const { addClip } = useContext(ClipContext);
  const concatFiles = async () => {
    setConcatenating(true);
    const list = Array.from(videoItems);

    const paths = await Promise.all(
      list
        .sort((a, b) => a.startTime - b.startTime)
        .map((it) => getResource(it.video.getPath()))
    );

    const ffmpeg = await getFFmpeg();

    const output = getOutputFileName.next().value;
    await ffmpeg.concatVideos(output, ...paths);

    addClip(new ClipVideo(output));
    setConcatenating(false);
  };

  return (
    <div className={styles.wrap}>
      <WsPlayer workspace={workspace} />
      <Slider
        onChange={(_, value) => setOneSecWidth(value as number)}
        min={1}
        max={100}
      />
      <div>
        {ditems.map((it, i) => (
          <WorkSpaceItem key={it.video.id} index={i} item={it} />
        ))}
      </div>
      <div className={styles.scroll} ref={areaRef}>
        <div className={styles.scrollLeft}>
          <div>scale</div>
          <div>video</div>
        </div>
        <div className={styles.scrollInner}>
          <Scale duration={workspace.duration} pxPerSec={OneSecWidth} />
          <div className={styles.videoArea} ref={ref}>
            {videoItems.map((it, i) => (
              <WsDraggableVideo
                key={i}
                index={i}
                video={it.video}
                color={getColor(i)}
                startTime={it.startTime}
                duration={it.duration}
                onItemHover={onHover}
                pxPerSec={OneSecWidth}
                removeVideo={removeVideo(it.video)}
              />
            ))}
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
