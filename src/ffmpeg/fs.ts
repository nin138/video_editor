import { fetchFile } from '@ffmpeg/ffmpeg';

export class FS {
  static FILE_DIR = '/files/';
  static CLIP_DIR = '/clips/';
  constructor(private fs: (...args: any) => any) {}

  async writeFile(file: File, fileName?: string): Promise<string> {
    const path = FS.FILE_DIR + (fileName || file.name);
    this.fs('writeFile', path, new Uint8Array(await file.arrayBuffer()));
    return path;
  }

  async writeFileFromURL(url: string, fileName: string) {
    const file = await fetchFile(url);
    this.fs('writeFile', FS.FILE_DIR + fileName, file);
  }

  rmFile(fileName: string) {
    return this.fs('unlink', fileName);
  }

  async makeDir(name: string) {
    return this.fs('mkdir', name);
  }

  async readFile(fileName: string): Promise<Uint8Array> {
    return this.fs('readFile', fileName);
  }

  async readDir(path: string): Promise<string[]> {
    return this.fs('readdir', path);
  }
}
