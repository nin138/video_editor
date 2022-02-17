import React, { useEffect, useRef, useState } from 'react';
import styles from './WsItem.module.css';
import { useDrag, useDrop, XYCoord } from 'react-dnd';
import { DraggingWsOverlayVideo, DragItemType } from '../workspaceDraggable';
import { useCombinedRefs } from '../../../../util';
import { getEmptyImage } from 'react-dnd-html5-backend';
import { WsVideoView } from './WsVideoView';
import { useElementRect } from '../../../../hooks/useElementRect';
import { PopOver } from '../../../Atoms/PopOver';
import { ContextMenu } from './ContextMenu';
import { calcTransform } from '../translate';
import { WsOverlay } from '../../../../context/workspace/WsLayerItem';
import { OverlayVideoModal } from '../Modal/OverlayVideoModal';
import { WorkspaceActionDispatcher } from '../../../../context/workspace/WorkspaceAction';

interface Props {
  item: WsOverlay;
  pxPerSec: number;
  wsId: string;
  wsDispatcher: WorkspaceActionDispatcher;
}

export const WsOverlayVideo: React.VFC<Props> = ({ wsId, item, pxPerSec, wsDispatcher }) => {
  const dragItem: DraggingWsOverlayVideo = {
    type: DragItemType.WsOverlayVideo,
    ...item,
    pxPerSec,
  };
  const [modal, setModal] = useState(false);

  const draggableRef = useRef<HTMLElement>();

  useEffect(() => {
    preview(getEmptyImage(), { captureDraggingState: true });
  }, []);

  const rect = useElementRect(draggableRef);

  const [{ isDragging }, drag, preview] = useDrag<DraggingWsOverlayVideo, unknown, { isDragging: boolean }>(
    () => ({
      type: DragItemType.WsOverlayVideo,
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

  const ref = useCombinedRefs<any>(drag, draggableRef);

  return (
    <div
      ref={ref}
      className={styles.video}
      style={{
        transform: calcTransform(item.startTime, pxPerSec),
      }}
    >
      <ContextMenu
        id={item.id + 'context'}
        menu={[
          {
            title: '編集',
            onClick: () => {
              setModal(true);
            },
          },
          {
            title: '削除',
            onClick: () => {
              wsDispatcher.removeLayer(wsId, item.id);
            },
          },
        ]}
      >
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
              color={isDragging ? '#555555' : '#333'}
              width={item.duration * pxPerSec}
            />
          </div>
        )}
      </ContextMenu>
      {modal && (
        <OverlayVideoModal
          video={item.video}
          chromaData={item.chroma}
          onClose={() => setModal(false)}
          onSave={(_, chroma, onClose) => {
            wsDispatcher.updateOverlayVideo(wsId, { ...item, chroma });
            onClose();
          }}
        />
      )}
      <PopOver targetRef={draggableRef}>
        {item.video.fileName()}
        <br />
        Duration: {item.duration}sec
      </PopOver>
    </div>
  );
};
