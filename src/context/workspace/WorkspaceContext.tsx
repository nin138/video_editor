import React, { useMemo, useReducer, useState } from 'react';
import { getDefaultWorkspace, SelectedItemType, Workspace } from '../../entities/workspace';
import { Video } from '../../entities/video';
import { WorkspaceActionDispatcher } from './WorkspaceAction';
import { workspaceReducer, WorkspaceState } from './WorkspaceReducer';

const ws = getDefaultWorkspace(0);

type SelectedItem =
  | {
      type: typeof SelectedItemType.Video;
      item: Video;
    }
  | {
      type: typeof SelectedItemType.Workspace;
      item: Workspace;
    };

const initialState: WorkspaceState = {
  workspaces: [ws],
};

interface Context {
  workspaces: Workspace[];
  dispatcher: WorkspaceActionDispatcher;
  selectedItem: SelectedItem;
  setSelectedItem: (item: Workspace | Video) => void;
}

export const WorkspaceContext = React.createContext<Context>({
  workspaces: initialState.workspaces,
  dispatcher: new WorkspaceActionDispatcher(() => {}),
  selectedItem: {
    type: SelectedItemType.Workspace,
    item: initialState.workspaces[0],
  },
  setSelectedItem: () => {},
});

export const WorkspaceProvider: React.FC = ({ children }) => {
  const [{ workspaces }, dispatch] = useReducer(workspaceReducer, initialState);
  const dispatcher = useMemo(() => new WorkspaceActionDispatcher(dispatch), [dispatch]);
  const [selectedItem, setSelectedItem] = useState<Video | string>(initialState.workspaces[0].id);

  const isWs = typeof selectedItem === 'string';

  const context: Context = {
    workspaces,
    dispatcher,
    selectedItem: {
      type: isWs ? SelectedItemType.Workspace : SelectedItemType.Video,
      item: isWs ? workspaces.find((it) => it.id === selectedItem)! : selectedItem,
    } as SelectedItem,
    setSelectedItem: (item) => setSelectedItem(item.type === SelectedItemType.Workspace ? item.id : item),
  };

  return <WorkspaceContext.Provider value={context}>{children}</WorkspaceContext.Provider>;
};
