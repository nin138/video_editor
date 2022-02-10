import React from 'react';
import styles from './File.module.css';
import { classNames } from '../../util';

interface Props {
  onClick: () => void;
  selected: boolean;
  fileName: string;
}

export const FileView: React.FC<Props> = ({
  onClick,
  selected,
  fileName,
  children,
}) => {
  return (
    <div className={classNames(styles.file, selected ? styles.selected : '')}>
      <div onClick={onClick} className={styles.fileName}>
        {fileName}
      </div>
      {children}
    </div>
  );
};
