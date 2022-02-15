import React, { useRef, useState } from 'react';
import { useDrop } from 'react-dnd';
import { DragItemType, WsVideoDroppable } from './workspaceDraggable';
import styles from './Workspace.module.css';
import { classNames } from '../../util';
import { useElementRect } from '../../hooks/useElementRect';
import { WorkspaceActionDispatcher } from '../../context/workspace/WorkspaceAction';
import { ChromaKeyData } from '../../context/workspace/WsLayerItem';
import { ChromaKeyModal } from './Modal/ChromaVideoModal';
import { Video } from '../../entities/video';

const def: ChromaKeyData = {
  color: '#fff',
  similarity: 0.01,
  blend: 0,
  startTime: 0,
};

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
        <ChromaKeyModal
          video={droppedVideo}
          wsId={wsId}
          wsDispatcher={wsDispatcher}
          onClose={() => setDroppedVideo(null)}
        />
      ) : null}
    </div>
  );
};
