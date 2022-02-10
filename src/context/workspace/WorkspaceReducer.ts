import { Reducer } from 'react';
import {
  getDefaultWorkspace,
  Workspace,
  WsVideoItem,
} from '../../entities/workspace';
import { WorkspaceAction, WsActionTypes } from './WorkspaceAction';

export interface WorkspaceState {
  workspaces: Workspace[];
}

export const workspaceReducer: Reducer<WorkspaceState, WorkspaceAction> = (
  prevState,
  action
) => {
  const updateWs = (wsId: string, cb: (ws: Workspace) => Workspace) => {
    return {
      ...prevState,
      workspaces: prevState.workspaces.map((it) =>
        it.id === wsId ? cb(it) : it
      ),
    };
  };

  switch (action.type) {
    case WsActionTypes.AddWorkSpace:
      return {
        ...prevState,
        workspaces: [
          ...prevState.workspaces,
          getDefaultWorkspace(prevState.workspaces.length),
        ],
      };
    case WsActionTypes.UpdateWorkspace: {
      return updateWs(action.wsId, action.updater);
    }
    case WsActionTypes.AddVideoToWorkspace: {
      const item: WsVideoItem = {
        video: action.video,
        duration: action.duration,
        startTime: prevState.workspaces
          .find((it) => it.id === action.wsId)!
          .videoItems.reduce(
            (previousValue, currentValue) =>
              previousValue + currentValue.duration,
            0
          ),
      };
      return updateWs(action.wsId, (ws) => ({
        ...ws,
        videoItems: [...ws.videoItems, item],
      }));
    }
    case WsActionTypes.RemoveVideoFromWs: {
      return updateWs(action.wsId, (ws) => ({
        ...ws,
        videoItems: ws.videoItems.filter(
          (it) => it.video.id !== action.video.id
        ),
      }));
    }
    default:
      return prevState;
  }
};
