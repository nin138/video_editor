import React, { useState } from 'react';
import styles from '../Workspace.module.css';
import { Card, Modal, TextField, Typography } from '@mui/material';
import Slider from '@mui/material/Slider';
import Button from '@mui/material/Button';
import { ChromaKeyData } from '../../../context/workspace/WsLayerItem';
import { WorkspaceActionDispatcher } from '../../../context/workspace/WorkspaceAction';
import { Video } from '../../../entities/video';

const def: ChromaKeyData = {
  color: '#fff',
  similarity: 0.01,
  blend: 0,
  startTime: 0,
};

interface Props {
  wsId: string;
  wsDispatcher: WorkspaceActionDispatcher;
  video: Video;
  onClose: () => void;
}

export const ChromaKeyModal: React.VFC<Props> = ({ wsId, wsDispatcher, video, onClose }) => {
  const [chroma, setChroma] = useState(def);

  const onSaveClick = () => {
    wsDispatcher.addChromaKeyOverlay(wsId, {
      ...chroma,
      video,
    });
    onClose();
  };

  return (
    <Modal open={true} onClose={onClose}>
      <Card className={styles.modal}>
        <Typography>クロマキー合成</Typography>

        <TextField id="input-color" label="color" variant="outlined" value={chroma.color} />
        <div className={styles.modalInputArea}>
          similarity
          <div className={styles.modalSliderWrap}>
            <Typography className={styles.dataText}>{chroma.similarity}</Typography>
            <Slider
              min={0.01}
              max={1}
              step={0.01}
              value={chroma.similarity}
              onChange={(_, value) => {
                setChroma((prev) => ({ ...prev, similarity: value as number }));
              }}
            />
          </div>
        </div>
        <div className={styles.modalInputArea}>
          blend
          <div className={styles.modalSliderWrap}>
            <Typography className={styles.dataText}>{chroma.blend}</Typography>
            <Slider
              min={0}
              max={1}
              step={0.01}
              value={chroma.blend}
              onChange={(_, value) => {
                setChroma((prev) => ({ ...prev, blend: value as number }));
              }}
            />
          </div>
        </div>

        <div className={styles.modalInputArea}>
          blend
          <div className={styles.modalSliderWrap}>
            <Typography className={styles.dataText}>{chroma.blend}</Typography>
            <Slider
              min={0}
              max={1}
              step={0.01}
              value={chroma.blend}
              onChange={(_, value) => {
                setChroma((prev) => ({ ...prev, blend: value as number }));
              }}
            />
          </div>
        </div>
        <Button variant="outlined" onClick={onSaveClick}>
          Save
        </Button>
      </Card>
    </Modal>
  );
};
