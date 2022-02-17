import React, { MutableRefObject, ReactEventHandler, useEffect, useMemo, useRef, useState } from 'react';
import { Video as VIDEO } from '../../../entities/video';
import { toResource } from '../../../util';
import { useResource } from '../../../hooks/useResouce';

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
  // console.log(toResource(video.getUrl()));

  const url = useResource(video.getUrl);

  // const url = useMemo(() => toResource(video.getUrl()), []);
  // useEffect(() => {
  //   console.log('c')
  //   url = toResource(video.getUrl());
  //   console.log('a')
  // })
  // const [url] = useState(toResource(video.getUrl()));

  console.log(url);

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
