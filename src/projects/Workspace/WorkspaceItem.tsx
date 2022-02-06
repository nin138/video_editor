import React, { useRef } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { DragItemType, WorkspaceDragItem } from './workspaceDraggable';
import { WsVideoItem } from '../../entities/workspace';

interface Props {
  item: WsVideoItem;
  index: number;
}

type WithIndex<T> = { index: number } & T;

export const WorkSpaceItem: React.VFC<Props> = ({ item }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: DragItemType.Video,
    item: (monitor) => ({
      type: DragItemType.Video,
      ...item,
      initialX: monitor.getInitialClientOffset()!.x,
    }),
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  return (
    <div ref={drag} style={{ width: 100, border: 'solid' }}>
      {isDragging ? 'ddd' : ''}
      {item.video.fileName()}
    </div>
  );
};
