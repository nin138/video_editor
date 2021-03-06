import { createFFmpeg, LogCallback } from '@ffmpeg/ffmpeg';
import { nanoid } from 'nanoid';
import { FS } from './fs';
import { ChromaKeyData } from '../context/workspace/WsLayerItem';
export const FILE_DIR = '/files/';
export const CLIP_DIR = '/clips/';

export class FFmpeg {
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

  private async composition(base: string, overlay: string, filters: string[]) {
    const outFileName = 'composition_' + nanoid() + '.mp4';

    const args = [
      '-i',
      base,
      '-i',
      overlay,
      '-filter_complex',
      `${filters.join(';')}`,
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

    await this.ffmpeg.run(...args);
    return outFileName;
  }

  async overlay(base: string, overlay: string, startTime: number = 0) {
    const filters = [
      `[1:v]setpts=PTS-STARTPTS+${startTime}/TB[ovr]`,
      `[0:v][ovr]overlay=enable=gte(t\\,${startTime}):eof_action=pass[out]`,
    ];
    return this.composition(base, overlay, filters);
  }

  async chromaKey(base: string, overlay: string, chroma: ChromaKeyData, startTime: number = 0) {
    const filters = [
      `[1:v]colorkey=${chroma.color.replace('#', '0x')}:${chroma.similarity}:${chroma.blend}[ckout]`,
      `[ckout]setpts=PTS-STARTPTS+${startTime}/TB[ovr]`,
      `[0:v][ovr]overlay=enable=gte(t\\,${startTime}):eof_action=pass[out]`,
    ];
    return this.composition(base, overlay, filters);
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
