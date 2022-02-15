import { Reducer } from 'react';
import { getDefaultWorkspace, Workspace, WsVideoItem } from '../../entities/workspace';
import { WorkspaceAction, WsActionTypes } from './WorkspaceAction';
import { getColor } from '../../projects/Workspace/Draggable/getColor';
import { nanoid } from 'nanoid';

export interface WorkspaceState {
  workspaces: Workspace[];
}

const calcDuration = (ws: Workspace): Workspace => {
  return {
    ...ws,
    videoItems: ws.videoItems.sort((a, b) => a.startTime - b.startTime),
    duration: ws.videoItems.reduce((previousValue, currentValue) => previousValue + currentValue.duration, 0),
  };
};

export const workspaceReducer: Reducer<WorkspaceState, WorkspaceAction> = (prevState, action) => {
  const updateWs = (wsId: string, cb: (ws: Workspace) => Workspace) => {
    return {
      ...prevState,
      workspaces: prevState.workspaces.map((it) => (it.id === wsId ? calcDuration(cb(it)) : it)),
    };
  };

  switch (action.type) {
    case WsActionTypes.AddWorkSpace:
      return {
        ...prevState,
        workspaces: [...prevState.workspaces, getDefaultWorkspace(prevState.workspaces.length)],
      };
    case WsActionTypes.UpdateWorkspace: {
      return updateWs(action.wsId, action.updater);
    }
    case WsActionTypes.AddVideoToWorkspace: {
      const item: WsVideoItem = {
        itemId: nanoid(),
        video: action.video,
        duration: action.duration,
        color: getColor.next().value,
        startTime: prevState.workspaces
          .find((it) => it.id === action.wsId)!
          .videoItems.reduce((previousValue, currentValue) => previousValue + currentValue.duration, 0),
        url: action.url,
      };
      return updateWs(action.wsId, (ws) => ({
        ...ws,
        videoItems: [...ws.videoItems, item],
      }));
    }
    case WsActionTypes.RemoveVideoFromWs: {
      return updateWs(action.wsId, (ws) => ({
        ...ws,
        videoItems: ws.videoItems.filter((it) => it.itemId !== action.itemId),
      }));
    }
    case WsActionTypes.AddChromaKeyOverlay: {
      return updateWs(action.wsId, (ws) => ({
        ...ws,
        layers: [...ws.layers, action.item],
      }));
    }
  }
};
