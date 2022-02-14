import React, { useRef } from 'react';
import { useDrop } from 'react-dnd';
import { DragItemType, WsVideoDroppable } from './workspaceDraggable';
import styles from './Workspace.module.css';
import { WsDraggableVideo } from './Draggable/WsDraggableVideo';
import { classNames, useCombinedRefs } from '../../util';
import { useElementRect } from '../../hooks/useElementRect';
import { Workspace, WsVideoItem } from '../../entities/workspace';
import { swapPosition } from './Draggable/swapItemPosition';
import { WorkspaceActionDispatcher } from '../../context/workspace/WorkspaceAction';

interface Props {
  workspace: Workspace;
  wsDispatcher: WorkspaceActionDispatcher;
  pxPerSec: number;
}

export const VideoLine: React.VFC<Props> = ({ workspace, wsDispatcher, pxPerSec }) => {
  const videoItems = workspace.videoItems;

  const updateItems = (...newItems: WsVideoItem[]) => {
    wsDispatcher.updateWorkspace(workspace.id, (workspace) => ({
      ...workspace,
      videoItems: workspace.videoItems.map((it) => newItems.find((newItem) => newItem.itemId === it.itemId) || it),
    }));
  };

  const videoAreaRef = useRef<HTMLDivElement>();

  const rect = useElementRect(videoAreaRef);

  const [{ canDrop }, drop] = useDrop<WsVideoDroppable & { initialX: number }, unknown, { canDrop: boolean }>(
    () => ({
      accept: [DragItemType.Video, DragItemType.WorkspaceVideo],
      drop: (item, monitor) => {
        const x = monitor.getClientOffset()?.x;
        const w = rect?.left || 0;
        if (!x) return;

        if (item.type === DragItemType.Video) {
          wsDispatcher.addVideoToWs(workspace.id, item.video); // TODO Promise
        } else if (item.type === DragItemType.WorkspaceVideo) {
          return; // TODO when not snap
        }
      },
      canDrop: (item) => {
        return true;
      },
      collect: (monitor) => ({
        canDrop: monitor.canDrop(),
      }),
    }),
    [workspace.videoItems, workspace.id]
  );

  const onHover = (draggingId: string, overedId: string) => {
    if (draggingId === overedId) return;
    const dragging = videoItems.find((it) => it.itemId === draggingId)!;
    const target = videoItems.find((it) => it.itemId === overedId)!;
    const [i1, i2] = swapPosition(dragging, target);
    updateItems(i1, i2);
  };

  const removeVideo = (itemId: string) => {
    return () => wsDispatcher.removeVideoFromWs(workspace.id, itemId);
  };

  const ref = useCombinedRefs<any>(drop, videoAreaRef);

  return (
    <div className={classNames(styles.videoArea, canDrop ? styles.videoCanDrop : '')} ref={ref}>
      {videoItems.map((it, i) => (
        <WsDraggableVideo
          key={it.itemId}
          index={i}
          item={it}
          onItemHover={onHover}
          pxPerSec={pxPerSec}
          removeVideo={removeVideo(it.itemId)}
        />
      ))}
    </div>
  );
};
