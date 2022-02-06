import { Video } from '../../entities/video';

export const DragItemType = {
  Video: 'Video',
  WorkspaceVideo: 'WorkspaceVideo',
  WorkSpaceItem: 'WorkSpaceItem',
} as const;

export interface WorkspaceDragItem {
  type: keyof typeof DragItemType;
  video: Video;
  startTime: number;
}

export interface DraggingWsVideo {
  type: typeof DragItemType.WorkspaceVideo;
  video: Video;
  startTime: number;
  duration: number;
  index: number;
}

export interface DraggingVideo {
  type: typeof DragItemType.Video;
  video: Video;
}

export type WsVideoDroppable = DraggingWsVideo | DraggingVideo;
