import React, { useRef, useState } from 'react';
import { WorkspaceActionDispatcher } from '../../context/workspace/WorkspaceAction';
import { ChromaKeyData } from '../../context/workspace/WsLayerItem';
import { Workspace } from '../../entities/workspace';
import { WsChromaKeyLayer } from './WsChromaKeyLayer';

const def: ChromaKeyData = {
  color: '#fff',
  similarity: 0.01,
  blend: 0,
  startTime: 0,
};

interface Props {
  workspace: Workspace;
  wsDispatcher: WorkspaceActionDispatcher;
  // pxPerSec: number;
}

export const WsLayers: React.VFC<Props> = ({ workspace, wsDispatcher }) => {
  const items = workspace.layers;

  return (
    <>
      {items.map((it) => (
        <WsChromaKeyLayer item={it} />
      ))}
    </>
  );
};
