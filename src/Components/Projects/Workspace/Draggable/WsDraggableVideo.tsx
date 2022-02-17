import React, { useEffect, useRef } from 'react';
import styles from './WsItem.module.css';
import { useDrag, useDrop, XYCoord } from 'react-dnd';
import { DraggingWsVideo, DragItemType } from '../workspaceDraggable';
import { useCombinedRefs } from '../../../../util';
import { getEmptyImage } from 'react-dnd-html5-backend';
import { WsVideoView } from './WsVideoView';
import { useElementRect } from '../../../../hooks/useElementRect';
import { PopOver } from '../../../Atoms/PopOver';
import { ContextMenu } from './ContextMenu';
import { WsVideoItem } from '../../../../entities/workspace';
import { calcTransform } from '../translate';

interface Props {
  item: WsVideoItem;
  index: number;
  onItemHover: (draggingId: string, targetId: string) => void;
  pxPerSec: number;
  removeVideo: () => void;
}

export const WsDraggableVideo: React.VFC<Props> = ({ item, onItemHover, pxPerSec, removeVideo }) => {
  const dragItem: DraggingWsVideo = {
    type: DragItemType.WorkspaceVideo,
    itemId: item.itemId,
    video: item.video,
    startTime: item.startTime,
    duration: item.duration,
    color: item.color,
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
          ...dragItem,
          initialX: monitor.getClientOffset()!.x - draggableRef.current!.getBoundingClientRect().left,
          xy: monitor.getClientOffset(),
        };
      },
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
      }),
    }),
    [item.startTime, pxPerSec]
  );

  const [, drop] = useDrop<DraggingWsVideo, unknown, unknown>(
    () => ({
      accept: DragItemType.WorkspaceVideo,
      hover: (dragging, monitor) => {
        console.log('hover');
        if (dragging.itemId === item.itemId) return;
        const mousePosition = monitor.getClientOffset();
        if (!mousePosition || !rect) return;

        const hoverClientX = mousePosition.x - rect.left;
        const hoverMiddleX = rect.width / 2;
        if (dragging.startTime < item.startTime && hoverClientX < hoverMiddleX * 0.6) return;
        if (dragging.startTime > item.startTime && hoverClientX > hoverMiddleX * 1.6) return;
        console.log('hover3');
        onItemHover(dragging.itemId, item.itemId);
        dragging.startTime = dragging.startTime > item.startTime ? item.startTime : dragging.startTime + item.duration;
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
        transform: calcTransform(item.startTime, pxPerSec),
      }}
    >
      <ContextMenu id={item.itemId} menu={[{ title: '削除', onClick: removeVideo }]}>
        {(props) => (
          <div
            id={props.id}
            onContextMenu={props.onClick}
            aria-controls={props['aria-controls']}
            aria-haspopup={props['aria-haspopup']}
            aria-expanded={props['aria-expanded']}
          >
            <WsVideoView
              className={isDragging ? styles.dragging : ''}
              name={item.video.fileName()}
              color={isDragging ? '#555555' : item.color}
              width={item.duration * pxPerSec}
            />
          </div>
        )}
      </ContextMenu>

      <PopOver targetRef={draggableRef}>
        {item.video.fileName()}
        <br />
        Duration: {item.duration}sec
      </PopOver>
    </div>
  );
};
