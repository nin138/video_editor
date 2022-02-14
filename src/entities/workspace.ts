import { Video } from './video';
import { nanoid } from 'nanoid';

export interface Workspace {
  type: typeof SelectedItemType.Workspace;
  id: string;
  name: string;
  videoItems: WsVideoItem[];
  duration: number;
}

export interface WsVideoItem {
  video: Video;
  startTime: number;
  duration: number;
  url: string;
  color: string;
}

export const SelectedItemType = {
  Video: 'Video',
  Workspace: 'Workspace',
} as const;

export const getDefaultWorkspace = (i: number): Workspace => ({
  type: SelectedItemType.Workspace,
  name: 'workspace' + (i + 1),
  id: nanoid(),
  videoItems: [],
  duration: 0,
});
