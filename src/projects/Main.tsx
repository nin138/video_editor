import React, { useContext } from 'react';
import styles from '../App.module.css';
import { VideoControl } from '../video/VideoControl';
import { WorkSpace } from './Workspace/Workspace';
import { SelectedItemType } from '../entities/workspace';
import { WorkspaceContext } from '../context/WorkspaceContext';

export const Main: React.FC = () => {
  const context = useContext(WorkspaceContext);
  const body = () => {
    if (context.selectedItemType === SelectedItemType.Video) {
      return <VideoControl selectedVideo={context.selectedItem} />;
    }
    return <WorkSpace />;
  };

  return <main className={styles.main}>{body()}</main>;
};
