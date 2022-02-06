import { CLIP_DIR, getFFmpeg } from '../ffmpeg/ffmpeg';
import { nanoid } from 'nanoid';
import { getResource } from '../util';
import { SelectedItemType } from './workspace';

export interface Video {
  type: typeof SelectedItemType.Video;
  getUrl(): Promise<string> | string;
  fileName(): string;
  getPath(): Promise<string> | string;
  id: Readonly<string>;
  getDuration(): Promise<number> | number;
}

abstract class VideoBase implements Video {
  readonly type = SelectedItemType.Video;
  private duration?: number | Promise<number>;
  readonly id = nanoid();

  async getDuration() {
    if (this.duration) return this.duration;
    const path = await getResource(this.getPath());
    const ffmpeg = await getFFmpeg();
    await ffmpeg.getInfo(path);
    return 0;
  }

  abstract fileName(): string;

  abstract getPath(): Promise<string> | string;

  abstract getUrl(): Promise<string> | string;
}

export class LocalVideo extends VideoBase {
  private url: Promise<string> | string | undefined = undefined;
  private path: Promise<string> | string | undefined = undefined;

  constructor(readonly file: File) {
    super();
  }

  fileName = () => {
    return this.file.name;
  };

  getPath: () => Promise<string> | string = () => {
    if (this.path) return this.path;
    this.path = new Promise<string>(async (resolve) => {
      const ffmpeg = await getFFmpeg();
      const path = await ffmpeg.writeFile(this.file, this.id + '.mp4');
      this.path = path;
      resolve(path);
    });
    return this.path;
  };

  getUrl: () => Promise<string> | string = () => {
    if (this.url) return this.url;
    this.url = new Promise(async (resolve) => {
      const data = await this.file.arrayBuffer();
      this.url = URL.createObjectURL(new Blob([data]));
      resolve(this.url);
    });
    return this.url;
  };
}

export class ClipVideo extends VideoBase {
  private url: Promise<string> | string | undefined = undefined;

  constructor(private name: string) {
    super();
  }

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
