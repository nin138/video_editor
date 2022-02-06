import React, { useRef, useState } from 'react';
import { useDrop } from 'react-dnd';
import { DragItemType, WsVideoDroppable } from './workspaceDraggable';
import { WorkSpaceItem } from './WorkspaceItem';
import styles from './Workspace.module.css';
import { Scale } from './Scale';
import { WsDraggableVideo } from './Draggable/WsDraggableVideo';
import { Video } from '../../entities/video';
import { useCombinedRefs } from '../../util';
import { useElementRect } from '../../hooks/useElementRect';
import { CustomDragLayer } from './CustomDragLayer';
import { WsVideoItem } from '../../entities/workspace';

const ditems: WsVideoItem[] = [
  {
    video: {
      type: 'Video',
      getUrl: () => '',
      fileName: () => 'assss',
      getPath: () => '',
      getDuration: () => 300,
      id: '1',
    },
    startTime: 0,
  },
  {
    video: {
      type: 'Video',
      getUrl: () => '',
      fileName: () => 'afehj',
      getPath: () => '',
      getDuration: () => 200,
      id: '2',
    },
    startTime: 50,
  },
  {
    video: {
      type: 'Video',
      getUrl: () => '',
      fileName: () => 'ytujhty',
      getPath: () => '',
      getDuration: () => 500,
      id: '3',
    },
    startTime: 30,
  },
];

export interface DraggingWsVideoData {
  type: typeof DragItemType.WorkspaceVideo;
  video: Video;
  index: number;
}

const COLORS = ['#f00', '#0f0', '#00f', '#ff0', '#f0f', '#0ff'];

const getColor = (i: number): string => {
  return COLORS[i % COLORS.length];
};

const OneSecWidth = 30;

export const WorkSpace: React.VFC = () => {
  const [items, setItems] = useState<WsVideoItem[]>([]);

  const addItem = (item: WsVideoItem) => {
    setItems((items) => [...items, item]);
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
        // const w = videoAreaRef.current?.getBoundingClientRect().left || 0;
        console.log('drop', item);
        const w = rect?.left || 0;
        if (item.type === DragItemType.Video) {
          addItem({
            video: item.video,
            startTime: monitor.getClientOffset()!.x - item.initialX,
          });
        } else if (item.type === DragItemType.WorkspaceVideo) {
          const newItems = [...items];
          console.log('init', item.initialX);

          newItems.splice(item.index, 1, {
            video: item.video,
            startTime: monitor.getClientOffset()!.x - w - item.initialX,
          });

          setItems(newItems);
        }
      },
    }),
    [items]
  );
  const ref = useCombinedRefs<any>(drop, videoAreaRef);
  return (
    <div className={styles.wrap}>
      <div>
        {ditems.map((it, i) => (
          <WorkSpaceItem key={it.video.id} index={i} item={it} />
        ))}
      </div>
      <div
        className={styles.scroll}
        // targetElementClass={''}
        // ignoreElements={'WsItem_video__qztr3'}
      >
        <div className={styles.scrollLeft}>
          <div>scale</div>
          <div>video</div>
        </div>
        <div
          className={styles.scrollInner}
          style={{ paddingLeft: OneSecWidth }}
        >
          <Scale duration={50} width={OneSecWidth} />
          <div
            className={styles.videoArea}
            ref={ref}
            onDragEnd={(e) => console.log(e)}
          >
            {items.map((it, i) => (
              <WsDraggableVideo
                key={i}
                index={i}
                video={it.video}
                color={getColor(i)}
                width={100}
                left={it.startTime}
              />
            ))}
          </div>
          <CustomDragLayer />
        </div>
      </div>
    </div>
  );
};
