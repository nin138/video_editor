import React, { useRef, useState } from 'react';
import { useDrop } from 'react-dnd';
import { DragItemType, WsVideoDroppable } from './workspaceDraggable';
import styles from './Workspace.module.css';
import { classNames } from '../../../util';
import { useElementRect } from '../../../hooks/useElementRect';
import { WorkspaceActionDispatcher } from '../../../context/workspace/WorkspaceAction';
import { OverlayVideoModal } from './Modal/OverlayVideoModal';
import { Video } from '../../../entities/video';

interface Props {
  wsId: string;
  wsDispatcher: WorkspaceActionDispatcher;
  // pxPerSec: number;
}

export const NextLine: React.VFC<Props> = ({ wsId, wsDispatcher }) => {
  const videoAreaRef = useRef<HTMLDivElement>();
  const rect = useElementRect(videoAreaRef);
  const [droppedVideo, setDroppedVideo] = useState<Video | null>(null);

  const [{ canDrop }, drop] = useDrop<WsVideoDroppable & { initialX: number }, unknown, { canDrop: boolean }>(
    () => ({
      accept: [DragItemType.Video],
      drop: (item, monitor) => {
        setDroppedVideo(item.video);
        const x = monitor.getClientOffset()?.x;
        const w = rect?.left || 0;
        if (!x) return;
      },
      canDrop: (item) => {
        return true;
      },
      collect: (monitor) => ({
        canDrop: monitor.canDrop(),
      }),
    }),
    [wsId]
  );

  return (
    <div className={classNames(styles.line, canDrop ? styles.videoCanDrop : '')} ref={drop}>
      {!!droppedVideo ? (
        <OverlayVideoModal
          onSave={(video, chroma, onClose) => {
            wsDispatcher.addOverlayVideo(wsId, {
              chroma,
              video,
              startTime: 0,
            });
            onClose();
          }}
          video={droppedVideo}
          onClose={() => setDroppedVideo(null)}
        />
      ) : null}
    </div>
  );
};
