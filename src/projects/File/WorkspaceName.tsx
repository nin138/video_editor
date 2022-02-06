import React, { useState } from 'react';
import styles from './File.module.css';
import { classNames } from '../../util';
import { Workspace } from '../../entities/workspace';

interface Props {
  workspace: Workspace;
  onClick: () => void;
  selected: boolean;
}

export const WorkspaceName: React.FC<Props> = ({
  workspace,
  onClick,
  selected,
}) => {
  return (
    <div className={classNames(styles.file, selected ? styles.selected : '')}>
      <div onClick={onClick} className={styles.fileName}>
        {workspace.name}
      </div>
    </div>
  );
};
