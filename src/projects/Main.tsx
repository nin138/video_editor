import React, { useContext } from 'react';
import styles from '../App.module.css';
import { VideoControl } from '../video/VideoControl';
import { WorkSpace } from './Workspace/Workspace';
import { SelectedItemType } from '../entities/workspace';
import { WorkspaceContext } from '../context/workspace/WorkspaceContext';

export const Main: React.FC = () => {
  const { selectedItem, dispatcher } = useContext(WorkspaceContext);
  const body = () => {
    switch (selectedItem.type) {
      case SelectedItemType.Video:
        return <VideoControl selectedVideo={selectedItem.item} />;
      case SelectedItemType.Workspace: {
        return <WorkSpace workspace={selectedItem.item} wsDispatcher={dispatcher} />;
      }
    }
  };

  return <main className={styles.main}>{body()}</main>;
};
