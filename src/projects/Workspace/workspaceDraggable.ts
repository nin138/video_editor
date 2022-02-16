import { Video } from '../../entities/video';
import { WsOverlay } from '../../context/workspace/WsLayerItem';

export const DragItemType = {
  Video: 'Video',
  WorkspaceVideo: 'WorkspaceVideo',
  WsOverlayVideo: 'WsOverlayVideo',
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

export interface DraggingWsOverlayVideo extends WsOverlay {
  type: typeof DragItemType.WsOverlayVideo;
  pxPerSec: number;
}

export type WsVideoDroppable = DraggingWsVideo | DraggingVideo;

export type Draggable = WsVideoDroppable | DraggingWsOverlayVideo;
