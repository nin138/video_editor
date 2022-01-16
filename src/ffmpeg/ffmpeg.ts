import { createFFmpeg, fetchFile } from '@ffmpeg/ffmpeg';

class FFmpeg {
  private ffmpeg = createFFmpeg({
    log: true,
    corePath: 'https://unpkg.com/@ffmpeg/core@0.10.0/dist/ffmpeg-core.js',
  });

  init(): Promise<void> {
    return this.ffmpeg.load();
  }

  async writeFileFromURL(url: string, fileName: string) {
    const file = await fetchFile(url);
    this.ffmpeg.FS('writeFile', fileName, file);
  }

  async getInfo(fileName: string) {
    const r = this.ffmpeg.run('-i', fileName);
    console.log(r);
    await r;
  }

  async sliceVideo(
    startSec: number,
    endSec: number,
    fileName: string,
    outFileName: string
  ) {
    await this.ffmpeg.run(
      '-ss',
      startSec.toString(),
      '-t',
      (endSec - startSec).toString(),
      '-i',
      fileName,
      '-c',
      'copy',
      outFileName
    );
  }

  async readFile(fileName: string): Promise<Uint8Array> {
    return this.ffmpeg.FS('readFile', fileName);
  }
}

const ffmpeg = new FFmpeg();

export const getFFmpeg = async (): Promise<FFmpeg> => {
  await ffmpeg.init();
  return ffmpeg;
};
