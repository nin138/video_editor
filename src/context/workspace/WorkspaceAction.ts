import { Workspace } from '../../entities/workspace';
import { Video } from '../../entities/video';
import { WsOverlay } from './WsLayerItem';
import { nanoid } from 'nanoid';

export const WsActionTypes = {
  AddWorkSpace: 'AddWorkSpace',
  UpdateWorkspace: 'UpdateWorkspace',
  AddVideoToWorkspace: 'AddVideoToWorkspace',
  RemoveVideoFromWs: 'RemoveVideoFromWs',
  AddOverlayVideo: 'AddOverlayVideo',
  UpdateOverlay: 'UpdateOverlay',
  RemoveLayer: 'RemoveLayer',
} as const;

interface AddWorkSpaceAction {
  type: typeof WsActionTypes.AddWorkSpace;
}

interface UpdateWorkSpace {
  type: typeof WsActionTypes.UpdateWorkspace;
  wsId: string;
  updater: (workspace: Workspace) => Workspace;
}

interface AddVideoToWorkspace {
  type: typeof WsActionTypes.AddVideoToWorkspace;
  wsId: string;
  duration: number;
  url: string;
  video: Video;
}

interface RemoveVideoFromWs {
  type: typeof WsActionTypes.RemoveVideoFromWs;
  wsId: string;
  itemId: string;
}

interface AddOverlayVideo {
  type: typeof WsActionTypes.AddOverlayVideo;
  wsId: string;
  item: WsOverlay;
}

interface UpdateOverlayVideo {
  type: typeof WsActionTypes.UpdateOverlay;
  wsId: string;
  item: Partial<WsOverlay> & Pick<WsOverlay, 'id'>;
}

interface RemoveLayer {
  type: typeof WsActionTypes.RemoveLayer;
  wsId: string;
  itemId: string;
}

export type WorkspaceAction =
  | AddWorkSpaceAction
  | UpdateWorkSpace
  | AddVideoToWorkspace
  | RemoveVideoFromWs
  | AddOverlayVideo
  | UpdateOverlayVideo
  | RemoveLayer;

export class WorkspaceActionDispatcher {
  constructor(private _dispatch: (action: WorkspaceAction) => void) {}

  private dispatch = (action: WorkspaceAction) => {
    console.log(action.type);
    this._dispatch(action);
  };

  addWorkspace = () => {
    this.dispatch({
      type: WsActionTypes.AddWorkSpace,
    });
  };

  updateWorkspace = (wsId: string, updater: (workspace: Workspace) => Workspace) => {
    this.dispatch({
      type: WsActionTypes.UpdateWorkspace,
      wsId,
      updater,
    });
  };

  addVideoToWs = async (wsId: string, video: Video): Promise<void> => {
    return this.dispatch({
      type: WsActionTypes.AddVideoToWorkspace,
      wsId,
      video,
      duration: await video.getDuration(),
      url: await video.getUrl(),
    });
  };

  removeVideoFromWs = (wsId: string, itemId: string) => {
    this.dispatch({
      type: WsActionTypes.RemoveVideoFromWs,
      wsId,
      itemId,
    });
  };

  addOverlayVideo = async (wsId: string, item: Omit<WsOverlay, 'id' | 'duration'>) => {
    this.dispatch({
      type: WsActionTypes.AddOverlayVideo,
      wsId,
      item: { ...item, id: nanoid(), duration: await item.video.getDuration() },
    });
  };

  updateOverlayVideo = (wsId: string, item: Partial<WsOverlay> & Pick<WsOverlay, 'id'>) => {
    this.dispatch({
      type: WsActionTypes.UpdateOverlay,
      wsId,
      item,
    });
  };

  removeLayer = (wsId: string, itemId: string) => {
    this.dispatch({
      type: WsActionTypes.RemoveLayer,
      wsId,
      itemId,
    });
  };
}
