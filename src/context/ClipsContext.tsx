import React, { useState } from 'react';
import { Video } from '../entities/video';

interface Context {
  clips: Video[];
  addClip: (video: Video) => void;
}

export const ClipContext = React.createContext<Context>({
  clips: [],
  addClip: () => {},
});

export const ClipContextProvider: React.FC = ({ children }) => {
  const [clips, setClips] = useState<Video[]>([]);
  const context: Context = {
    clips,
    addClip: (clip) => setClips((prev) => [...prev, clip]),
  };
  return <ClipContext.Provider value={context}>{children}</ClipContext.Provider>;
};
