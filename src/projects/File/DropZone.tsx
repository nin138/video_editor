import React from 'react';
import { ErrorCode, FileError, useDropzone } from 'react-dropzone';
import styles from './File.module.css';
import { classNames } from '../../util';
import { IconButton } from '@mui/material';
import { FolderIcon } from '../../atoms/Icons';
import { Option } from '../../atoms/Option';
interface Props {
  onDrop: (files: File[]) => void;
}

const validator: <T extends File>(file: T) => FileError | FileError[] | null = (
  file
) => {
  if (file.type !== 'video/mp4') {
    return {
      code: ErrorCode.FileInvalidType,
      message: file.type,
    };
  }
  return null;
};

export const Dropzone: React.FC<Props> = ({ onDrop, children }) => {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    validator,
  });

  const { onClick, ...rootProps } = getRootProps();
  return (
    <div {...rootProps} className={styles.dropZone}>
      <input {...getInputProps()} />
      <Option display={isDragActive}>
        <div className={styles.hover} />
      </Option>
      <div className={styles.head} onClick={onClick}>
        {isDragActive
          ? 'Drop the files here ...'
          : 'Drag and drop mp4 files or click here'}
        <FolderIcon className={styles.folderIcon} />
      </div>
      {children}
    </div>
  );
};
