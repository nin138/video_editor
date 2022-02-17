import React from 'react';
import { WorkspaceActionDispatcher } from '../../../context/workspace/WorkspaceAction';
import { Workspace } from '../../../entities/workspace';
import { WsOverlayLayer } from './WsOverlayLayer';

interface Props {
  workspace: Workspace;
  wsDispatcher: WorkspaceActionDispatcher;
  pxPerSec: number;
}

export const WsLayers: React.VFC<Props> = ({ workspace, wsDispatcher, pxPerSec }) => {
  const items = workspace.layers;

  return (
    <>
      {items.map((it) => (
        <WsOverlayLayer key={it.id} item={it} pxPerSec={pxPerSec} wsId={workspace.id} wsDispatcher={wsDispatcher} />
      ))}
    </>
  );
};
