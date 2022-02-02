import React, { useContext, useState } from 'react';
import { Dropzone } from './DropZone';
import { File } from './File';
import styles from './File.module.css';
import { SelectedVideoContext } from '../../context/VideoUrl';
import { classNames } from '../../util';
import { LocalVideo, Video } from '../../context/video';
import { ClipContext } from '../../context/Clips';

export const FileZone: React.FC = () => {
  const [files, setFiles] = useState<LocalVideo[]>([]);

  const onFileDrop = (newFiles: File[]) => {
    setFiles((current) => [
      ...current,
      ...newFiles.map((it) => new LocalVideo(it)),
    ]);
  };

  const { dispatch } = useContext(SelectedVideoContext);
  const onFileClick = async (video: Video) => {
    dispatch(video);
  };

  const { clips } = useContext(ClipContext);

  return (
    <div className={styles.fileZone}>
      <Dropzone onDrop={onFileDrop}>
        <div className={classNames(styles.scroll, styles.files)}>
          {files.map((it, i) => (
            <File key={i} video={it} onClick={() => onFileClick(it)} />
          ))}
        </div>
      </Dropzone>
      <div className={styles.head}>clips</div>
      <div className={classNames(styles.scroll, styles.clips)}>
        {clips.map((it, i) => (
          <File key={i} video={it} onClick={() => onFileClick(it)} />
        ))}
      </div>
    </div>
  );
};
