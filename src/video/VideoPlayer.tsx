import React, { MutableRefObject, ReactEventHandler } from 'react';
import { Video as VIDEO } from '../entities/video';

interface Props {
  videoRef: MutableRefObject<HTMLVideoElement | null>;
  onEnded: ReactEventHandler<HTMLVideoElement>;
  onLoadedData: ReactEventHandler<HTMLVideoElement>;
  onPlay: ReactEventHandler<HTMLVideoElement>;
  onPause: ReactEventHandler<HTMLVideoElement>;
  className: string;
  video: VIDEO;
}

export const VideoPlayer: React.FC<Props> = ({
  video,
  videoRef,
  onPause,
  onPlay,
  onEnded,
  className,
  onLoadedData,
}) => {
  const url = video.getUrl();

  if (typeof url !== 'string') throw url;
  return (
    <video
      ref={videoRef}
      onEnded={onEnded}
      onLoadedData={onLoadedData}
      onPlay={onPlay}
      onPause={onPause}
      src={url}
      controls
      className={className}
    />
  );
};
