import React, { useState } from 'react';
import styles from './File.module.css';
import { Video } from '../../context/video';
import { IconButton } from '../../atoms/Button/IconButton';
import { DownloadIcon } from '../../atoms/Icons';

interface Props {
  video: Video;
  onClick: () => void;
}

export const File: React.FC<Props> = ({ video, onClick }) => {
  const dlRef = React.createRef<HTMLAnchorElement>();
  const [dlWaiting, setDlWaiting] = useState(false);

  const download = async () => {
    setDlWaiting(true);
    let url = video.getUrl();
    if (url instanceof Promise) {
      url = await url;
    }
    dlRef.current!.href = url;
    dlRef.current!.click();
    setDlWaiting(false);
  };

  return (
    <div onClick={onClick} className={styles.file}>
      <div className={styles.fileName}>{video.fileName()}</div>
      <a ref={dlRef} download={video.fileName()} />
      <IconButton onClick={download} className={styles.dlIconButton}>
        <DownloadIcon className={styles.dlIcon} />
      </IconButton>
    </div>
  );
};
