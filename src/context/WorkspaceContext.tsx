import React, { useState } from 'react';
import {
  getDefaultWorkspace,
  SelectedItemType,
  Workspace,
} from '../entities/workspace';
import { Video } from '../entities/video';

interface PartialContext {
  workspaces: Workspace[];
  updateWorkSpace: (wsId: string, ws: Workspace) => void;
  addWorkSpace: () => void;
  selectedItem: Workspace | Video;
  selectedItemType: keyof typeof SelectedItemType;
  setSelectedItem: (item: Workspace | Video) => void;
}

interface VideoContext {
  selectedItemType: typeof SelectedItemType.Video;
  selectedItem: Video;
}

interface WsContext {
  selectedItemType: typeof SelectedItemType.Workspace;
  selectedItem: Workspace;
}

type Context = PartialContext & (VideoContext | WsContext);

export const WorkspaceContext = React.createContext<Context>({
  workspaces: [],
  updateWorkSpace: () => {},
  addWorkSpace: () => {},
  selectedItem: getDefaultWorkspace(0),
  selectedItemType: 'Workspace',
  setSelectedItem: () => {},
});

export const WorkspaceProvider: React.FC = ({ children }) => {
  const [workspaces, setWorkspaces] = useState<Workspace[]>([
    getDefaultWorkspace(0),
  ]);
  const [item, setItem] = useState<Video | string>(workspaces[0].id);

  const isWs = typeof item === 'string';

  const context: Context = {
    workspaces,
    updateWorkSpace: (wsId, ws) =>
      setWorkspaces((workspaces) =>
        workspaces.map((it) => {
          if (it.id !== wsId) return it;
          return ws;
        })
      ),
    addWorkSpace: () =>
      setWorkspaces([...workspaces, getDefaultWorkspace(workspaces.length)]),
    setSelectedItem: (item: Video | Workspace) => {
      if (item.type === SelectedItemType.Video) {
        setItem(item as Video);
      } else {
        setItem(item.id);
      }
    },
    selectedItemType: isWs
      ? SelectedItemType.Workspace
      : SelectedItemType.Video,
    selectedItem: isWs ? workspaces.find((it) => it.id === item)! : item,
  } as Context;

  return (
    <WorkspaceContext.Provider value={context}>
      {children}
    </WorkspaceContext.Provider>
  );
};
