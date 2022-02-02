import { createFFmpeg, fetchFile } from '@ffmpeg/ffmpeg';

export const FILE_DIR = '/files/';
export const CLIP_DIR = '/clips/';

class FFmpeg {
  private ffmpeg = createFFmpeg({
    log: true,
    corePath: 'https://unpkg.com/@ffmpeg/core@0.10.0/dist/ffmpeg-core.js',
  });

  init(): Promise<void> {
    if (this.ffmpeg.isLoaded()) return Promise.resolve();
    return this.ffmpeg.load();
  }

  private fs(): (...args: any) => any {
    return this.ffmpeg.FS;
  }

  async writeFile(file: File, fileName?: string): Promise<string> {
    const path = FILE_DIR + (fileName || file.name);
    this.ffmpeg.FS('writeFile', path, new Uint8Array(await file.arrayBuffer()));
    return path;
  }

  async writeFileFromURL(url: string, fileName: string) {
    const file = await fetchFile(url);
    this.ffmpeg.FS('writeFile', FILE_DIR + fileName, file);
  }

  async getInfo(fileName: string) {
    const r = this.ffmpeg.run('-i', fileName);
    console.log(r);
    await r;
  }

  async clipVideo(
    startSec: number,
    endSec: number,
    path: string,
    outFileName: string
  ) {
    console.log('------st---------');
    console.log(startSec, endSec);
    console.log('-----------e-------');

    const fmt = (sec: number) =>
      new Date(sec * 1000).toISOString().substring(11, 22);

    const duration = fmt(endSec - startSec);
    await this.ffmpeg.run(
      '-ss',
      fmt(startSec),
      '-t',
      duration,
      '-i',
      path,
      '-c',
      'copy',
      CLIP_DIR + outFileName
    );
  }

  async makeDir(name: string) {
    return this.fs()('mkdir', name);
  }

  async readFile(fileName: string): Promise<Uint8Array> {
    return this.ffmpeg.FS('readFile', fileName);
  }

  async readDir(path: string): Promise<string[]> {
    return this.fs()('readdir', path);
  }
}

const ffmpeg = new FFmpeg();

const initialize = new Promise(async (resolve) => {
  await ffmpeg.init();
  await Promise.all([ffmpeg.makeDir(FILE_DIR), ffmpeg.makeDir(CLIP_DIR)]);
  resolve('');
});

export const getFFmpeg = async (): Promise<FFmpeg> => {
  await initialize;
  return ffmpeg;
};

(window as unknown as any).ffmpeg = ffmpeg;
