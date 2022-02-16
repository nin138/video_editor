import { Video } from '../../entities/video';

export interface ChromaKeyData {
  color: string;
  similarity: number;
  blend: number;
}

export interface WsOverlay {
  id: string;
  video: Video;
  startTime: number;
  duration: number;
  chroma?: ChromaKeyData;
}

export type WsLayerItem = WsOverlay;
