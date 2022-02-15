import React, { useRef, useState } from 'react';
import { useDrop } from 'react-dnd';
import { DragItemType, WsVideoDroppable } from './workspaceDraggable';
import styles from './Workspace.module.css';
import { classNames } from '../../util';
import { WsChromaKeyOverlay } from '../../context/workspace/WsLayerItem';

interface Props {
  item: WsChromaKeyOverlay;
}

export const WsChromaKeyLayer: React.VFC<Props> = ({ item }) => {
  const [{ canDrop }, drop] = useDrop<WsVideoDroppable & { initialX: number }, unknown, { canDrop: boolean }>(() => ({
    accept: [DragItemType.Video], // TODO
    drop: (item, monitor) => {},
    canDrop: (item) => {
      return true; // TODO
    },
    collect: (monitor) => ({
      canDrop: monitor.canDrop(),
    }),
  }));

  return (
    <div className={classNames(styles.line, canDrop ? styles.videoCanDrop : '')} ref={drop}>
      <div>{item.video.fileName()}</div>
    </div>
  );
};
