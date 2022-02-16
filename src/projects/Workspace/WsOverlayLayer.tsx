import React, { useRef } from 'react';
import { useDrop } from 'react-dnd';
import { DraggingWsOverlayVideo, DragItemType } from './workspaceDraggable';
import styles from './Workspace.module.css';
import { classNames, useCombinedRefs } from '../../util';
import { WsOverlay } from '../../context/workspace/WsLayerItem';
import { WsOverlayVideo } from './Draggable/WsOverlayVideo';
import { WorkspaceActionDispatcher } from '../../context/workspace/WorkspaceAction';
import { useElementRect } from '../../hooks/useElementRect';

interface Props {
  wsId: string;
  item: WsOverlay;
  pxPerSec: number;
  wsDispatcher: WorkspaceActionDispatcher;
}

export const WsOverlayLayer: React.VFC<Props> = ({ item, pxPerSec, wsId, wsDispatcher }) => {
  const areaRef = useRef<HTMLDivElement>();
  const rect = useElementRect(areaRef);

  const [{ canDrop }, drop] = useDrop<DraggingWsOverlayVideo & { initialX: number }, unknown, { canDrop: boolean }>(
    () => ({
      accept: [DragItemType.WsOverlayVideo],
      drop: (item, monitor) => {
        const x = monitor.getClientOffset()?.x;
        const x2 = monitor.getInitialClientOffset()?.x;
        if (!x || !x2) return;
        console.log(x - x2!);
        console.log(x, x2);
        wsDispatcher.updateOverlayVideo(wsId, { id: item.id, startTime: item.startTime + (x - x2) / pxPerSec });
      },
      canDrop: (dragging) => {
        return item.id === dragging.id;
      },
      collect: (monitor) => ({
        canDrop: monitor.canDrop(),
      }),
    }),
    [pxPerSec, item]
  );

  const ref = useCombinedRefs<any>(drop, areaRef);

  return (
    <div className={classNames(styles.line, canDrop ? styles.videoCanDrop : '')} ref={ref}>
      <WsOverlayVideo item={item} pxPerSec={pxPerSec} wsId={wsId} wsDispatcher={wsDispatcher} />
    </div>
  );
};
