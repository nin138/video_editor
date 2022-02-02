import React, { useState } from 'react';
import { Video } from './video';

interface Context {
  selectedVideo?: Video;
  dispatch: (video: Video) => void;
}

export const SelectedVideoContext = React.createContext<Context>({
  dispatch: () => {},
});

export const SelectedVideoContextProvider: React.FC = ({ children }) => {
  const [video, setVideo] = useState<Video>();
  const context: Context = {
    selectedVideo: video,
    dispatch: (video) => setVideo(video),
  };
  return (
    <SelectedVideoContext.Provider value={context}>
      {children}
    </SelectedVideoContext.Provider>
  );
};
