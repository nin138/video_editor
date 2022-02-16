import { Workspace, WsVideoItem } from '../entities/workspace';
import { getResource } from '../util';
import { getFFmpeg } from './ffmpeg';
import { getOutputFileName } from './getFileName';
import { ClipVideo, Video } from '../entities/video';
import { WsOverlay } from '../context/workspace/WsLayerItem';

const concatVideos = async (videoItems: WsVideoItem[]): Promise<Video> => {
  const list = Array.from(videoItems);
  if (list.length === 1) return list[0].video;

  const paths = await Promise.all(
    list.sort((a, b) => a.startTime - b.startTime).map((it) => getResource(it.video.getPath()))
  );

  const ffmpeg = await getFFmpeg();

  const output = getOutputFileName.next().value;
  await ffmpeg.concatVideos(output, ...paths);

  return new ClipVideo(output);
};

const overlay = async (base: Video, item: WsOverlay) => {
  const ffmpeg = await getFFmpeg();
  const path = item.chroma
    ? await ffmpeg.chromaKey(base, item.video, item.chroma, item.startTime)
    : await ffmpeg.overlay(base, item.video, item.startTime);
  return new ClipVideo(path);
};

export const encodeVideo = async (ws: Workspace) => {
  let current: Video = await concatVideos(ws.videoItems);

  for (let i = 0; i < ws.layers.length; i++) {
    const layer = ws.layers[i];
    current = await overlay(current, layer);
  }
  return current;
};
