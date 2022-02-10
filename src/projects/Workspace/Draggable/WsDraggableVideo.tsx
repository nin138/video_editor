import React, { useEffect, useRef, useState } from 'react';
import styles from './WsItem.module.css';
import { Video } from '../../../entities/video';
import { useDrag, useDrop, XYCoord } from 'react-dnd';
import { DraggingWsVideo, DragItemType } from '../workspaceDraggable';
import { useCombinedRefs } from '../../../util';
import { getEmptyImage } from 'react-dnd-html5-backend';
import { WsVideoView } from './WsVideoView';
import { useElementRect } from '../../../hooks/useElementRect';
import { PopOver } from '../../../atoms/PopOver';
import { ContextMenu } from './ContextMenu';

interface Props {
  video: Video;
  color: string;
  index: number;
  duration: number;
  startTime: number;
  onItemHover: (draggingIndex: number, targetIndex: number) => void;
  pxPerSec: number;
  removeVideo: () => void;
}

export const WsDraggableVideo: React.VFC<Props> = ({
  video,
  color,
  index,
  duration,
  startTime,
  onItemHover,
  pxPerSec,
  removeVideo,
}) => {
  const item: DraggingWsVideo = {
    type: DragItemType.WorkspaceVideo,
    video,
    index,
    startTime,
    duration,
    pxPerSec,
  };

  const draggableRef = useRef<HTMLElement>();

  useEffect(() => {
    preview(getEmptyImage(), { captureDraggingState: true });
  }, []);

  const rect = useElementRect(draggableRef);

  const [{ isDragging }, drag, preview] = useDrag<
    DraggingWsVideo & { xy: XYCoord | null },
    { cb: (x?: number) => void },
    { isDragging: boolean }
  >(
    () => ({
      type: DragItemType.WorkspaceVideo,
      item: (monitor) => {
        return {
          ...item,
          initialX:
            monitor.getClientOffset()!.x -
            draggableRef.current!.getBoundingClientRect().left,
          xy: monitor.getClientOffset(),
        };
      },
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
      }),
    }),
    [startTime, pxPerSec]
  );

  const [, drop] = useDrop<DraggingWsVideo, unknown, unknown>(
    () => ({
      accept: DragItemType.WorkspaceVideo,
      hover: (dragging, monitor) => {
        if (dragging.index === index) return;
        const mousePosition = monitor.getClientOffset();
        if (!mousePosition || !rect) return;

        const hoverClientX = mousePosition.x - rect.left;
        const hoverMiddleX = rect.width / 2;

        if (
          dragging.startTime < item.startTime &&
          hoverClientX < hoverMiddleX * 0.6
        )
          return;
        if (
          dragging.startTime > item.startTime &&
          hoverClientX > hoverMiddleX * 1.6
        )
          return;

        onItemHover(dragging.index, index);
        dragging.startTime =
          dragging.startTime > item.startTime
            ? item.startTime
            : dragging.startTime + item.duration;
      },
    }),
    [onItemHover]
  );

  const ref = useCombinedRefs<any>(drag, draggableRef, drop);

  return (
    <div
      ref={ref}
      className={styles.video}
      style={{
        transform: `translate(${startTime * pxPerSec}px)`,
        opacity: isDragging ? 0 : 1,
      }}
    >
      <ContextMenu
        id={video.id}
        menu={[{ title: '削除', onClick: removeVideo }]}
      >
        {(props) => (
          <div
            id={props.id}
            onContextMenu={props.onClick}
            aria-controls={props['aria-controls']}
            aria-haspopup={props['aria-haspopup']}
            aria-expanded={props['aria-expanded']}
          >
            <WsVideoView
              name={video.fileName()}
              color={color}
              width={duration * pxPerSec}
            />
          </div>
        )}
      </ContextMenu>

      <PopOver targetRef={draggableRef}>
        {video.fileName()}
        <br />
        Duration: {duration}sec
      </PopOver>
    </div>
  );
};
