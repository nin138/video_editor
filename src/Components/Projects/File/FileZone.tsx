import React, { useContext, useState } from 'react';
import { Dropzone } from './DropZone';
import { File } from './File';
import styles from './File.module.css';
import { Workspaces } from './Workspaces';
import { WorkspaceContext } from '../../../context/workspace/WorkspaceContext';
import { SelectedItemType } from '../../../entities/workspace';
import { LocalVideo, Video } from '../../../entities/video';
import { ClipContext } from '../../../context/ClipsContext';
import { ScrollContainer } from '../../Atoms/ScrollContainer';
import { classNames } from '../../../util';

const NoItem: React.FC = () => {
  return (
    <div className={styles.noItem}>
      <div className={styles.noItemInner}>ここにファイルをドロップ</div>
    </div>
  );
};

export const FileZone: React.FC = () => {
  const [files, setFiles] = useState<LocalVideo[]>([]);
  const { selectedItem, setSelectedItem, dispatcher } = useContext(WorkspaceContext);
  const selectedVideoId = selectedItem.type === SelectedItemType.Video ? selectedItem.item.id : '';

  const onFileDrop = (newFiles: File[]) => {
    setFiles((current) => [...current, ...newFiles.map((it) => new LocalVideo(it))]);
  };

  const onFileClick = async (video: Video) => {
    setSelectedItem(video);
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
          addToWorkspace={
            selectedItem.type === SelectedItemType.Workspace
              ? (video) => dispatcher.addVideoToWs(selectedItem.item.id, video)
              : undefined
          }
        />
      ))
    );

  return (
    <div className={styles.fileZone}>
      <Dropzone onDrop={onFileDrop}>
        <ScrollContainer className={classNames(styles.scroll, styles.files)}>{fileElements}</ScrollContainer>
      </Dropzone>
      <div className={styles.head}>clips</div>
      <ScrollContainer className={classNames(styles.scroll, styles.clips)}>
        {clips.map((it, i) => (
          <File selected={selectedVideoId === it.id} key={i} video={it} onClick={() => onFileClick(it)} />
        ))}
      </ScrollContainer>
      <Workspaces />
    </div>
  );
};
