import LabelIcon from '@mui/icons-material/Label';
import React from 'react';
import styles from './Icons.module.css';
import { classNames } from '../util';
import PlayCircleIcon from '@mui/icons-material/PlayCircle';
import StopCircleIcon from '@mui/icons-material/StopCircle';
import MuiRepeatIcon from '@mui/icons-material/Repeat';
import SettingsEthernetIcon from '@mui/icons-material/SettingsEthernet';
import ContentCutIcon from '@mui/icons-material/ContentCut';
import FolderOpenIcon from '@mui/icons-material/FolderOpen';
import DIcon from '@mui/icons-material/Download';
import AddBoxIcon from '@mui/icons-material/AddBox';
import PlayForWorkIcon from '@mui/icons-material/PlayForWork';

interface Props {
  style?: React.CSSProperties;
  className?: string;
}

export const LabelLeft: React.FC<Props> = ({ style, className }) => (
  <LabelIcon style={style} className={classNames(styles.labelIcon, className)} />
);
export const LabelRight: React.FC<Props> = ({ style, className }) => (
  <LabelIcon style={style} className={classNames(styles.labelIcon, styles.rotate180, className)} />
);

export const PlayStopIcon: React.FC<{ playing: boolean }> = ({ playing }) => {
  if (!playing) return <PlayCircleIcon />;
  return <StopCircleIcon />;
};

export const RepeatIcon: React.FC = () => {
  return <MuiRepeatIcon />;
};

export const PlaySelectedRangeIcon: React.FC = () => {
  return <SettingsEthernetIcon />;
};

export const CutIcon = ContentCutIcon;
export const FolderIcon = FolderOpenIcon;
export const DownloadIcon = DIcon;
export const AddIcon = AddBoxIcon;
export const AddToWorkspaceIcon = PlayForWorkIcon;
