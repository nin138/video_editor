import { Video } from '../../entities/video';

export interface ChromaKeyData {
  color: string;
  similarity: number;
  blend: number;
  startTime: number;
}

export interface WsChromaKeyOverlay extends ChromaKeyData {
  id: string;
  video: Video;
}

export type WsLayerItem = WsChromaKeyOverlay;
