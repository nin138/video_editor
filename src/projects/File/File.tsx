import React, { useState } from 'react';
import styles from './File.module.css';
import { Video } from '../../entities/video';
import { IconButton } from '../../atoms/Button/IconButton';
import { DownloadIcon } from '../../atoms/Icons';
import { classNames } from '../../util';

interface Props {
  video: Video;
  onClick: () => void;
  selected: boolean;
}

export const File: React.FC<Props> = ({ video, onClick, selected }) => {
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
    <div className={classNames(styles.file, selected ? styles.selected : '')}>
      <div onClick={onClick} className={styles.fileName}>
        {video.fileName()}
      </div>
      <a ref={dlRef} download={video.fileName()} />
      <IconButton
        onClick={download}
        className={styles.dlIconButton}
        popOver={'ダウンロード'}
      >
        <DownloadIcon className={styles.dlIcon} />
      </IconButton>
    </div>
  );
};
