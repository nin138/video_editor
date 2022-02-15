import { createFFmpeg, LogCallback } from '@ffmpeg/ffmpeg';
import { nanoid } from 'nanoid';
import { FS } from './fs';
import { Video } from '../entities/video';
import { getResource } from '../util';
import { ChromaKeyData } from '../context/workspace/WsLayerItem';
export const FILE_DIR = '/files/';
export const CLIP_DIR = '/clips/';

class FFmpeg {
  private defaultLogger: LogCallback = ({ type, message }) => {
    console.log(`type: ${type}|m=${message}`);
  };

  private ffmpeg = createFFmpeg({
    log: false,
    corePath: 'https://unpkg.com/@ffmpeg/core@0.10.0/dist/ffmpeg-core.js',
    logger: this.defaultLogger,
    progress: (progressParams) => console.log(progressParams),
  });

  fs: FS = new FS(this.ffmpeg.FS);

  init(): Promise<void> {
    if (this.ffmpeg.isLoaded()) return Promise.resolve();
    return this.ffmpeg.load();
  }

  async getInfo(fileName: string) {
    const r = this.ffmpeg.run('-i', fileName);
    console.log(r);
    await r;
  }

  /**
   * @deprecated
   */
  async getDuration(fileName: string): Promise<number> {
    return new Promise((resolve, reject) => {
      const logger: LogCallback = ({ type, message }) => {
        if (message.includes('Duration')) {
          const regex = /.*Duration.*(\d{2})\:(\d{2})\:(\d{2})\.(\d{2})/gm;
          const matches = regex.exec(String(message));
          if (matches != null) {
            const h = Number(matches[1]);
            const m = Number(matches[2]);
            const s = Number(matches[3]);
            const ms = Number('0.' + matches[4]);
            const duration = h * 3600 + m * 60 + s + ms;
            this.ffmpeg.setLogger(this.defaultLogger);
            resolve(duration);
          }
          this.ffmpeg.setLogger(this.defaultLogger);
          reject(new Error('Duration Not Found'));
        }
      };
      this.ffmpeg.setLogger(logger);
      this.ffmpeg.run('-i', fileName);
    });
  }

  async clipVideo(startSec: number, endSec: number, path: string, outFileName: string) {
    console.log('------st---------');
    console.log(startSec, endSec);
    console.log('-----------e-------');

    const fmt = (sec: number) => new Date(sec * 1000).toISOString().substring(11, 22);

    const duration = fmt(endSec - startSec);
    await this.ffmpeg.run('-ss', fmt(startSec), '-t', duration, '-i', path, '-c', 'copy', CLIP_DIR + outFileName);
  }

  async concatVideos(outputFileName: string, ...paths: string[]) {
    const fileList = paths.map((it) => `file ${it}`).join('\n');
    const path = `/${nanoid()}.txt`;
    await this.ffmpeg.FS('writeFile', path, new TextEncoder().encode(fileList));
    const result = this.ffmpeg.run('-f', 'concat', '-safe', '0', '-i', path, '-c', 'copy', CLIP_DIR + outputFileName);
    this.fs.rmFile(path);
    return result;
  }

  async chromaKey(base: Video, overlay: Video, config: ChromaKeyData) {
    const outFileName = 'composition_' + nanoid() + '.mp4';

    const filters = [
      `[1:v]colorkey=0x${config.color}:${config.similarity}:${config.blend}[ckout]`,
      `[ckout]setpts=PTS-STARTPTS+${config.startTime}/TB[ovr]`,
      `[0:v][ovr]overlay=enable=gte(t\\,${config.startTime}):eof_action=pass[out]`,
    ].join(';');

    const args = [
      '-i',
      await getResource(base.getPath()),
      '-i',
      await getResource(overlay.getPath()),
      '-filter_complex',
      `${filters}`,
      '-map',
      '[out]',
      '-map',
      '0:a?',
      '-c:a',
      'copy',
      '-movflags',
      '+faststart',
      CLIP_DIR + outFileName,
    ];
    console.log('--------------');
    console.log(args.join(' '));
    console.log('--------------');
    await this.ffmpeg.run(...args);
    return outFileName;
  }
}

const ffmpeg = new FFmpeg();

const initialize = new Promise(async (resolve) => {
  await ffmpeg.init();
  await Promise.all([ffmpeg.fs.makeDir(FILE_DIR), ffmpeg.fs.makeDir(CLIP_DIR)]);
  resolve('');
});

export const getFFmpeg = async (): Promise<FFmpeg> => {
  await initialize;
  return ffmpeg;
};

(window as unknown as any).ffmpeg = ffmpeg;
(window as unknown as any).fs = ffmpeg.fs;
