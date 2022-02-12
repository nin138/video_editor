import { Workspace } from '../../entities/workspace';
import { Video } from '../../entities/video';
import { getResource } from '../../util';

export const WsActionTypes = {
  AddWorkSpace: 'AddWorkSpace',
  UpdateWorkspace: 'UpdateWorkspace',
  AddVideoToWorkspace: 'AddVideoToWorkspace',
  RemoveVideoFromWs: 'RemoveVideoFromWs',
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
  video: Video;
}

export type WorkspaceAction =
  | AddWorkSpaceAction
  | UpdateWorkSpace
  | AddVideoToWorkspace
  | RemoveVideoFromWs;

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

  updateWorkspace = (
    wsId: string,
    updater: (workspace: Workspace) => Workspace
  ) => {
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
      duration: await getResource(video.getDuration()),
      url: await getResource(video.getUrl()),
    });
  };

  removeVideoFromWs = (wsId: string, video: Video) => {
    return this.dispatch({
      type: WsActionTypes.RemoveVideoFromWs,
      wsId,
      video,
    });
  };
}
