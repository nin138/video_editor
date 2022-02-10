import React from 'react';
import { useDrag } from 'react-dnd';
import { DraggingVideo, DragItemType } from './workspaceDraggable';
import { WsVideoItem } from '../../entities/workspace';

interface Props {
  item: WsVideoItem;
  index: number;
}

type WithIndex<T> = { index: number } & T;

export const WorkSpaceItem: React.VFC<Props> = ({ item }) => {
  const [{ isDragging }, drag] = useDrag<
    DraggingVideo,
    { cb: (x?: number) => void },
    { isDragging: boolean }
  >(() => ({
    type: DragItemType.Video,
    item: (monitor) => ({
      type: DragItemType.Video,
      ...item,
      initialX: monitor.getInitialClientOffset()!.x,
      xy: monitor.getClientOffset(),
    }),
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
      xy: monitor.getClientOffset(),
    }),
  }));

  return (
    <div ref={drag} style={{ width: 100, border: 'solid' }}>
      {isDragging ? 'ddd' : ''}
      {item.video.fileName()}
    </div>
  );
};
