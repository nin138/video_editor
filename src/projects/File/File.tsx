import React, { useEffect, useRef, useState } from 'react';
import styles from './File.module.css';
import { Video } from '../../entities/video';
import { classNames, getResource } from '../../util';
import { FileView } from './FileView';
import { useDrag } from 'react-dnd';
import { DraggingVideo, DragItemType } from '../Workspace/workspaceDraggable';
import { CircularProgress } from '@mui/material';
import { IconButton } from '../../atoms/Button/IconButton';
import { AddToWorkspaceIcon, DownloadIcon } from '../../atoms/Icons';
import { getEmptyImage } from 'react-dnd-html5-backend';

interface Props {
  video: Video;
  onClick: () => void;
  selected: boolean;
  addToWorkspace?: (video: Video) => void;
}

export const File: React.FC<Props> = ({ video, onClick, selected, addToWorkspace }) => {
  const dlRef = useRef<HTMLAnchorElement>(null);
  const [dlWaiting, setDlWaiting] = useState(false);

  const download = async () => {
    const a = dlRef.current;
    setDlWaiting(true);
    const url = await getResource(video.getUrl());
    a!.href = url;
    a!.click();
    setDlWaiting(false); // todo when too fast
  };

  const [, drag, preview] = useDrag<DraggingVideo, unknown, { isDragging: boolean }>(() => ({
    type: DragItemType.Video,
    item: (monitor) => ({
      type: DragItemType.Video,
      video: video,
    }),
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
      xy: monitor.getClientOffset(),
    }),
  }));

  useEffect(() => {
    preview(getEmptyImage(), { captureDraggingState: true });
  }, []);

  const dl = dlWaiting ? (
    <CircularProgress size={24} />
  ) : (
    <IconButton onClick={download} className={styles.dlIconButton} popOver={'ダウンロード'}>
      <DownloadIcon className={styles.dlIcon} />
    </IconButton>
  );

  const addToWs = addToWorkspace ? (
    <IconButton className={styles.dlIconButton} onClick={() => addToWorkspace(video)} popOver={'workspaceに追加する'}>
      <AddToWorkspaceIcon className={styles.dlIcon} />
    </IconButton>
  ) : null;

  return (
    <div ref={drag}>
      <FileView onClick={onClick} selected={selected} fileName={video.fileName()}>
        {addToWs}
        {dl}
      </FileView>
      <a ref={dlRef} download={video.fileName()} />
    </div>
  );
};
