import React from 'react';
import { ErrorCode, FileError, useDropzone } from 'react-dropzone';
import styles from './File.module.css';
import { FolderIcon } from '../../Atoms/Icons';
import { Option } from '../../Atoms/Option';

interface Props {
  onDrop: (files: File[]) => void;
}

const validator: <T extends File>(file: T) => FileError | FileError[] | null = (file) => {
  if (file.type !== 'video/mp4') {
    return {
      code: ErrorCode.FileInvalidType,
      message: file.type,
    };
  }
  if (file.size > 2147483648) {
    return {
      code: ErrorCode.FileTooLarge,
      message: 'file too large max file size = 2gb',
    };
  }
  return null;
};

export const Dropzone: React.FC<Props> = ({ onDrop, children }) => {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    validator,
    onDropRejected: (fileRejections) => {
      console.log(fileRejections);
      window.alert(
        fileRejections.map((it) => it.file.name + ':  ' + it.errors.map((it) => it.message).join(' ')).join('\n')
      );
    },
  });

  const { onClick, ...rootProps } = getRootProps();
  return (
    <div {...rootProps} className={styles.dropZone}>
      <input {...getInputProps()} />
      <Option display={isDragActive}>
        <div className={styles.hover} />
      </Option>
      <div className={styles.head} onClick={onClick} style={{ cursor: 'pointer' }}>
        {isDragActive ? 'ここにドロップしてね' : 'ファイルを選択'}
        <FolderIcon className={styles.folderIcon} />
      </div>
      {children}
    </div>
  );
};
