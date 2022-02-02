import { CLIP_DIR, getFFmpeg } from '../ffmpeg/ffmpeg';
import { nanoid } from 'nanoid';

export interface Video {
  getUrl(): Promise<string> | string;
  fileName(): string;
  getPath(): Promise<string> | string;
}

export class LocalVideo implements Video {
  private url: Promise<string> | string | undefined = undefined;
  private path: Promise<string> | string | undefined = undefined;
  private rand: string;

  constructor(readonly file: File) {
    this.rand = nanoid();
  }

  getUrl: () => Promise<string> | string = () => {
    if (this.url) return this.url;
    this.url = new Promise(async (resolve) => {
      const data = await this.file.arrayBuffer();
      this.url = URL.createObjectURL(new Blob([data]));
      resolve(this.url);
    });
    return this.url;
  };

  fileName = () => {
    return this.file.name;
  };

  getPath: () => Promise<string> | string = () => {
    if (this.path) return this.path;
    this.path = new Promise<string>(async (resolve) => {
      const ffmpeg = await getFFmpeg();
      const path = await ffmpeg.writeFile(this.file, this.rand + '.mp4');
      this.path = path;
      resolve(path);
    });
    return this.path;
  };
}

export class ClipVideo implements Video {
  private url: Promise<string> | string | undefined = undefined;
  constructor(private name: string) {}

  fileName(): string {
    return this.name;
  }

  getPath(): string {
    return CLIP_DIR + this.fileName();
  }

  getUrl: () => Promise<string> | string = () => {
    if (this.url) return this.url;
    this.url = new Promise<string>(async (resolve) => {
      const ffmpeg = await getFFmpeg();
      const data = await ffmpeg.readFile(await this.getPath());
      const url = URL.createObjectURL(new Blob([data.buffer]));
      this.url = url;
      resolve(url);
    });

    return this.url;
  };
}
