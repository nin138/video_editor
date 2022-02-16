import { ChromaKeyData } from '../context/workspace/WsLayerItem';
import { Video } from '../entities/video';
import { FFmpeg, getFFmpeg } from './ffmpeg';
import { getOutputFileName } from './getFileName';

const FlowTypes = {
  Noop: 'Noop',
  Video: 'Video',
  Concat: 'Concat',
  Overlay: 'Overlay',
} as const;

interface NoopFlow {
  type: typeof FlowTypes.Noop;
  path: string;
}

export interface ConcatFlow {
  type: typeof FlowTypes.Concat;
  paths: string[];
}

export interface OverlayFlow {
  type: typeof FlowTypes.Overlay;
  overlayPath: string;
  startTime: number;
  duration: number;
  chroma?: ChromaKeyData;
}

type Flow = OverlayFlow;

interface EditVideoWorkFlow {
  videoDuration: number;
  init: ConcatFlow | NoopFlow;
  flows: Flow[];
}

class FlowExecutor {
  static async create(): Promise<FlowExecutor> {
    return new FlowExecutor(await getFFmpeg());
  }

  constructor(private ffmpeg: FFmpeg) {}

  exec = () => async (flow: EditVideoWorkFlow) => {
    let current = flow.init.type === FlowTypes.Noop ? flow.init.path : await this.execConcatFlow(flow.init);
    for (let i = 0; i < flow.flows.length; i++) {
      current = await this.execFlows(current, flow.flows[i]);
    }

    return current;
  };

  private execFlows = async (prevPath: string, flow: Flow): Promise<string> => {
    switch (flow.type) {
      case FlowTypes.Overlay:
        return this.execOverlayFlow(prevPath, flow);
    }
  };

  private execConcatFlow = async (flow: ConcatFlow): Promise<string> => {
    if (flow.paths.length === 1) return flow.paths[0];

    const output = getOutputFileName.next().value;
    await this.ffmpeg.concatVideos(output, ...flow.paths);
    return output;
  };

  private execOverlayFlow = async (prevPath: string, flow: OverlayFlow): Promise<string> => {
    return flow.chroma
      ? await this.ffmpeg.chromaKey(prevPath, flow.overlayPath, flow.chroma, flow.startTime)
      : await this.ffmpeg.overlay(prevPath, flow.overlayPath, flow.startTime);
  };
}
