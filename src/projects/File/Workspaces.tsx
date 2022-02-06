import React, { useContext } from 'react';
import styles from './File.module.css';
import { classNames } from '../../util';
import { IconButton } from '../../atoms/Button/IconButton';
import { AddIcon } from '../../atoms/Icons';
import { WorkspaceName } from './WorkspaceName';
import { WorkspaceContext } from '../../context/WorkspaceContext';

export const Workspaces: React.FC = () => {
  const { workspaces, addWorkSpace, selectedItem, setSelectedItem } =
    useContext(WorkspaceContext);

  return (
    <div>
      <div className={styles.head}>
        <div className={styles.headText}>workspace</div>
        <IconButton
          className={styles.addWorkspaceIcon}
          onClick={addWorkSpace}
          popOver={'新規ワークスペース'}
        >
          <AddIcon />
        </IconButton>
      </div>
      <div className={classNames(styles.scroll, styles.workspace)}>
        {workspaces.map((it, i) => (
          <WorkspaceName
            key={i}
            workspace={it}
            onClick={() => setSelectedItem(it)}
            selected={selectedItem.id === it.id}
          />
        ))}
      </div>
    </div>
  );
};
