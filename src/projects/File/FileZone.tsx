import React, { useContext, useState } from 'react';
import { Dropzone } from './DropZone';
import { File } from './File';
import styles from './File.module.css';
import { classNames } from '../../util';
import { LocalVideo, Video } from '../../entities/video';
import { ClipContext } from '../../context/ClipsContext';
import { Workspaces } from './Workspaces';
import { WorkspaceContext } from '../../context/WorkspaceContext';
import { SelectedItemType } from '../../entities/workspace';

const NoItem: React.FC = () => {
  return (
    <div className={styles.noItem}>
      <div className={styles.noItemInner}>ここにファイルをドロップ</div>
    </div>
  );
};

export const FileZone: React.FC = () => {
  const [files, setFiles] = useState<LocalVideo[]>([]);
  const selectedItemContext = useContext(WorkspaceContext);
  const selectedVideoId =
    selectedItemContext.selectedItemType === SelectedItemType.Video
      ? selectedItemContext.selectedItem.id
      : '';

  const onFileDrop = (newFiles: File[]) => {
    setFiles((current) => [
      ...current,
      ...newFiles.map((it) => new LocalVideo(it)),
    ]);
  };

  const onFileClick = async (video: Video) => {
    selectedItemContext.setSelectedItem(video);
  };

  const { clips } = useContext(ClipContext);

  const fileElements =
    files.length === 0 ? (
      <NoItem />
    ) : (
      files.map((it, i) => (
        <File
          key={i}
          selected={selectedVideoId === it.id}
          video={it}
          onClick={() => onFileClick(it)}
        />
      ))
    );

  return (
    <div className={styles.fileZone}>
      <Dropzone onDrop={onFileDrop}>
        <div className={classNames(styles.scroll, styles.files)}>
          {fileElements}
        </div>
      </Dropzone>
      <div className={styles.head}>clips</div>
      <div className={classNames(styles.scroll, styles.clips)}>
        {clips.map((it, i) => (
          <File
            selected={selectedVideoId === it.id}
            key={i}
            video={it}
            onClick={() => onFileClick(it)}
          />
        ))}
      </div>
      <Workspaces />
    </div>
  );
};
