import { CLIP_DIR, getFFmpeg } from '../ffmpeg/ffmpeg';
import { nanoid } from 'nanoid';
import { SelectedItemType } from './workspace';

export interface Video {
  type: typeof SelectedItemType.Video;
  getUrl(): Promise<string>;
  fileName(): string;
  getPath(): Promise<string>;
  id: Readonly<string>;
  getDuration(): Promise<number>;
}

abstract class VideoBase implements Video {
  readonly type = SelectedItemType.Video;
  private duration?: Promise<number>;
  readonly id = nanoid();

  getDuration = (): Promise<number> => {
    if (this.duration) return this.duration;
    this.duration = new Promise(async (resolve) => {
      const url = this.getUrl();
      const el = document.createElement('video');
      el.setAttribute('style', 'display: none');
      el.setAttribute('src', await url);
      document.body.append(el);
      el.onloadedmetadata = () => {
        const duration = el.duration;
        el.remove();
        resolve(duration);
      };
    });
    return this.duration;
  };

  abstract fileName(): string;

  abstract getPath(): Promise<string>;

  abstract getUrl(): Promise<string>;
}

export class LocalVideo extends VideoBase {
  private url?: Promise<string>;
  private path?: Promise<string>;

  constructor(readonly file: File) {
    super();
  }

  fileName = () => {
    return this.file.name;
  };

  getPath: () => Promise<string> = () => {
    if (this.path) return this.path;
    this.path = new Promise<string>(async (resolve) => {
      const ffmpeg = await getFFmpeg();
      const path = await ffmpeg.fs.writeFile(this.file, this.id + '.mp4');
      resolve(path);
    });
    return this.path;
  };

  getUrl: () => Promise<string> = () => {
    if (this.url) return this.url;
    console.log(1);
    this.url = new Promise(async (resolve) => {
      console.log(2);
      const data = await this.file.arrayBuffer();
      console.log(3);
      resolve(URL.createObjectURL(new Blob([data])));
      console.log(4);
    });
    console.log(5);
    return this.url;
  };
}

export class ClipVideo extends VideoBase {
  private url?: Promise<string>;

  constructor(private name: string) {
    super();
  }

  fileName(): string {
    return this.name;
  }

  getPath(): Promise<string> {
    return Promise.resolve(CLIP_DIR + this.fileName());
  }

  getUrl: () => Promise<string> = () => {
    if (this.url) return this.url;
    this.url = new Promise<string>(async (resolve) => {
      const ffmpeg = await getFFmpeg();
      const data = await ffmpeg.fs.readFile(await this.getPath());
      const url = URL.createObjectURL(new Blob([data.buffer]));
      resolve(url);
    });

    return this.url;
  };
}
