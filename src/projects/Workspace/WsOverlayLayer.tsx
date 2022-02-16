import React from 'react';
import { useDrop } from 'react-dnd';
import { DragItemType, WsVideoDroppable } from './workspaceDraggable';
import styles from './Workspace.module.css';
import { classNames } from '../../util';
import { WsOverlay } from '../../context/workspace/WsLayerItem';
import { WsOverlayVideo } from './Draggable/WsOverlayVideo';
import { WorkspaceActionDispatcher } from '../../context/workspace/WorkspaceAction';

interface Props {
  wsId: string;
  item: WsOverlay;
  pxPerSec: number;
  wsDispatcher: WorkspaceActionDispatcher;
}

export const WsOverlayLayer: React.VFC<Props> = ({ item, pxPerSec, wsId, wsDispatcher }) => {
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
      <WsOverlayVideo item={item} pxPerSec={pxPerSec} wsId={wsId} wsDispatcher={wsDispatcher} />
    </div>
  );
};
