import { Video } from '../../entities/video';

export const DragItemType = {
  Video: 'Video',
  WorkspaceVideo: 'WorkspaceVideo',
} as const;

export interface DraggingWsVideo {
  type: typeof DragItemType.WorkspaceVideo;
  itemId: string;
  video: Video;
  startTime: number;
  duration: number;
  pxPerSec: number;
  color: string;
}

export interface DraggingVideo {
  type: typeof DragItemType.Video;
  video: Video;
}

export type WsVideoDroppable = DraggingWsVideo | DraggingVideo;
