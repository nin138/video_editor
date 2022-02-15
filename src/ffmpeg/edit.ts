import { Workspace, WsVideoItem } from '../entities/workspace';
import { getResource } from '../util';
import { getFFmpeg } from './ffmpeg';
import { getOutputFileName } from './getFileName';
import { ClipVideo, Video } from '../entities/video';

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

export const encodeVideo = async (ws: Workspace) => {
  const ffmpeg = await getFFmpeg();
  let current: Video = await concatVideos(ws.videoItems);

  for (let i = 0; i < ws.layers.length; i++) {
    const layer = ws.layers[i];
    current = new ClipVideo(await ffmpeg.chromaKey(current, layer.video, layer));
  }
  return current;
};
