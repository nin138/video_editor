import React, { useState } from 'react';
import { Typography } from '@mui/material';
import Button from '@mui/material/Button';
import { ChromaKeyData } from '../../../../context/workspace/WsLayerItem';
import { Video } from '../../../../entities/video';
import Switch from '@mui/material/Switch';
import { Option } from '../../../Atoms/Option';
import { isHexColor } from '../../../../util';
import { ModalNumberSelector } from './ModalNumberSelector';
import { Modal } from './Modal';
import styles from './Modal.module.css';
import { ColorPicker } from '../../../Atoms/Input/ColorPicker';

const def: ChromaKeyData = {
  color: '#fff',
  similarity: 0.01,
  blend: 0,
};

interface Props {
  video: Video;
  onClose: () => void;
  onSave: (video: Video, chroma: ChromaKeyData | undefined, onClose: () => void) => void;
  chromaData?: ChromaKeyData;
}

export const OverlayVideoModal: React.VFC<Props> = ({ chromaData, onSave, video, onClose }) => {
  const [useChroma, setUseChroma] = useState(!!chromaData);
  const [chroma, setChroma] = useState(chromaData || def);

  const isColorValid = chroma && isHexColor(chroma.color);

  const buttons = [
    <Button
      variant="contained"
      onClick={() => onSave(video, useChroma ? chroma : undefined, onClose)}
      disabled={useChroma && !isColorValid}
    >
      Save
    </Button>,
  ];

  return (
    <Modal open={true} onClose={onClose} title={'Video Overlay'} buttons={buttons}>
      <div className={styles.switchContainer}>
        <Typography>クロマキー合成</Typography>
        <Switch value={useChroma} onChange={(_, checked) => setUseChroma(checked)} />
      </div>
      <Option display={useChroma}>
        <ColorPicker
          id={'input-color'}
          color={chroma.color}
          error={!isColorValid}
          onChange={(color) => setChroma((prev) => ({ ...prev, color }))}
        />

        <ModalNumberSelector
          value={chroma.similarity}
          onChange={(value) => {
            setChroma((prev) => ({ ...prev, similarity: value }));
          }}
          min={0.01}
          max={1}
          step={0.01}
          label={'similarity'}
        />

        <ModalNumberSelector
          min={0}
          max={1}
          step={0.01}
          value={chroma.blend}
          label={'blend'}
          onChange={(value) => {
            setChroma((prev) => ({ ...prev, blend: value }));
          }}
        />
      </Option>
    </Modal>
  );
};
