import React, { ReactNode } from 'react';
import styles from './Modal.module.css';
import { Card, Modal as BaseModal } from '@mui/material';
import { ScrollContainer } from '../../../Atoms/ScrollContainer';

interface Props {
  open: boolean;
  title: string;
  onClose: () => void;
  children: ReactNode;
  buttons?: ReactNode[];
}

export const Modal: React.VFC<Props> = ({ open, children, onClose, buttons }) => {
  return (
    <BaseModal open={open} onClose={onClose}>
      <Card className={styles.modal}>
        <div className={styles.modalTitle}>
          <p className={styles.modalTitleText}>Video Overlay</p>
        </div>
        <ScrollContainer className={styles.container}>{children}</ScrollContainer>
        <div className={styles.flexContainer}>
          {buttons?.map((it, i) => (
            <div key={i} className={styles.buttonWrap}>
              {it}
            </div>
          ))}
        </div>
      </Card>
    </BaseModal>
  );
};
