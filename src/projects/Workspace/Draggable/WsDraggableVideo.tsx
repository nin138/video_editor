import React, { useEffect, useRef, useState } from 'react';
import styles from '../WsItem.module.css';
import { Video } from '../../../entities/video';
import { useDrag, XYCoord } from 'react-dnd';
import { DragItemType } from '../workspaceDraggable';
import { DraggingWsVideoData } from '../Workspace';
import { useCombinedRefs } from '../../../util';
import { getEmptyImage } from 'react-dnd-html5-backend';
import { WsVideoView } from './WsVideoView';

interface Props {
  video: Video;
  color: string;
  width: number;
  index: number;
  left: number;
}

export const WsDraggableVideo: React.VFC<Props> = ({
  video,
  color,
  width,
  left,
  index,
}) => {
  const item: DraggingWsVideoData = {
    type: DragItemType.WorkspaceVideo,
    video,
    index,
  };

  const draggableRef = useRef<HTMLElement>();

  const [{ isDragging }, drag, preview] = useDrag(() => ({
    type: DragItemType.WorkspaceVideo,
    // item: monitor => ({
    //   droppable: item,
    //   initialX: monitor.getClientOffset()!.x - draggableRef.current!.getBoundingClientRect().left}), // TODO memo
    item: (monitor) => {
      return {
        ...item,
        initialX:
          monitor.getClientOffset()!.x -
          draggableRef.current!.getBoundingClientRect().left,
      };
    }, // TODO memo
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));
  useEffect(() => {
    preview(getEmptyImage(), { captureDraggingState: true });
  }, []);

  const ref = useCombinedRefs<any>(drag, draggableRef);

  return (
    <div
      ref={ref}
      className={styles.video}
      style={{ transform: `translate(${left}px)`, opacity: isDragging ? 0 : 1 }}
    >
      <WsVideoView name={video.fileName()} color={color} width={width} />
    </div>
  );
};
