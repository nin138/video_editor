import React, { useContext, useState } from 'react';
import { Video } from '../entities/video';
import {
  getDefaultWorkspace,
  SelectedItemType,
  Workspace,
} from '../entities/workspace';
import { WorkspaceContext } from './workspace/WorkspaceContext';

interface VideoContext {
  type: typeof SelectedItemType.Video;
  selectedItem: Video;
  setSelectedItem: (item: Video | Workspace) => void;
}

interface WsContext {
  type: typeof SelectedItemType.Workspace;
  selectedItem: Workspace;
  setSelectedItem: (item: Video | Workspace) => void;
}

type Context = VideoContext | WsContext;

export const SelectedItemContext = React.createContext<Context>({
  setSelectedItem: () => {},
  type: SelectedItemType.Workspace,
  selectedItem: getDefaultWorkspace(0),
});

export const SelectedItemContextProvider: React.FC = ({ children }) => {
  const { workspaces } = useContext(WorkspaceContext);
  console.log(workspaces);
  const [item, setItem] = useState<Video | string>(workspaces[0].id);

  const isWs = typeof item === 'string';

  const context: Context = {
    selectedItem: isWs ? workspaces.find((it) => it.id === item)! : item,
    // setSelectedItem:  (item: Video | Workspace) => {
    //   if(item.type === SelectedItemType.Video) {
    //     setItem(item);
    //   } else {
    //     setItem(item.id)
    //   }
    // },
    type: isWs ? SelectedItemType.Workspace : SelectedItemType.Video,
  } as Context;

  return (
    <SelectedItemContext.Provider value={context}>
      {children}
    </SelectedItemContext.Provider>
  );
};
