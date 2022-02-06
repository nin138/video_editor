import styles from './VideoControl.module.css';
import React, {
  MutableRefObject,
  ReactEventHandler,
  useContext,
  useEffect,
  useState,
  Suspense,
} from 'react';
import { getFFmpeg } from '../ffmpeg/ffmpeg';
import { ToggleButton } from '../atoms/Button/ToggleButton';
import { Option } from '../atoms/Option';
import { TimeSlider } from './TimeSlider/TimeSlider';
import {
  CutIcon,
  LabelLeft,
  LabelRight,
  PlaySelectedRangeIcon,
  RepeatIcon,
} from '../atoms/Icons';
import { IconButton } from '../atoms/Button/IconButton';
import { PlayStopButton } from '../atoms/Button/PlayStopButton';
import { RangeData } from '../rangeData';
import { AppEventContext, AppEvents } from '../context/AppEvent';
import { CircularProgress } from '@mui/material';
import { ClipContext } from '../context/ClipsContext';
import { ClipVideo, Video } from '../entities/video';
import { VideoPlayer } from './VideoPlayer';

function* makeClipName() {
  let i = 0;
  while (true) {
    i++;
    const date = new Date();
    yield 'clip' +
      i +
      '-' +
      date.getFullYear() +
      '-' +
      (date.getMonth() + 1) +
      '-' +
      date.getDate() +
      '__' +
      date.toLocaleTimeString() +
      '.mp4';
  }
  return '';
}

const getClipName: Generator<string, string, string> = makeClipName();

interface Props {
  selectedVideo: Video;
}

export const VideoControl: React.FC<Props> = ({ selectedVideo }) => {
  const [videoDuration, setVideoDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);

  const { dispatch } = useContext(AppEventContext);

  const [selectedRange, setSelectedRange] = useState(new RangeData([0, 0]));
  const [playing, setPlaying] = useState(false);

  const [repeat, setRepeat] = useState(false);
  const [playOnlySelectedRange, setPlayOnlySelectedRange] = useState(false);
  const [clipping, setClipping] = useState(false);

  const { addClip } = useContext(ClipContext);

  const videoRef: MutableRefObject<HTMLVideoElement | null> =
    React.useRef(null);

  const onReady = (ref: HTMLVideoElement) => {
    console.log('ready');
    setVideoDuration(ref.duration);
    ref.volume = 0.1;
  };

  const onLoadedData: ReactEventHandler<HTMLVideoElement> = (element) => {
    if (element.currentTarget.readyState >= 2) {
      onReady(element.currentTarget);
    }
  };

  const onVideoSeeked = (value: number) => {
    setCurrentTime(value);
    if (videoRef.current) videoRef.current.currentTime = value;
  };

  const onRangeChanged: (values: number[]) => void = (values) => {
    if (!videoRef.current) return;

    setSelectedRange(selectedRange.update(values as [number, number]));
  };

  const videoRef2: MutableRefObject<HTMLVideoElement | null> =
    React.useRef(null);
  const onSliceButtonClicked = () => {
    if (clipping) return;
    setClipping(true);
    getFFmpeg()
      .then(async (it) => {
        const outFileName = getClipName.next().value;

        const input = await selectedVideo!.getPath();

        await it.clipVideo(
          selectedRange.start(),
          selectedRange.end(),
          input,
          outFileName
        );
        dispatch(AppEvents.ReadFile.message);

        setClipping(false);
        const clip = new ClipVideo(outFileName);
        addClip(clip);

        videoRef2.current!.src = await clip.getUrl();
      })
      .catch((e) => {
        console.error(e);
        dispatch(AppEvents.Error.message);
        setClipping(false);
      });
  };

  const onEnded = () => {
    if (repeat && videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play();
    }
  };

  const onPlay = () => {
    setPlaying(true);
    if (
      playOnlySelectedRange &&
      videoRef.current &&
      videoRef.current.currentTime > selectedRange.end()
    ) {
      videoRef.current.currentTime = selectedRange.start();
    }
  };
  const onPause = () => {
    setPlaying(false);
  };

  useEffect(() => {
    const listener = () => {
      if (!videoRef.current || videoRef.current.readyState <= 2) return;
      setCurrentTime(videoRef.current.currentTime);
      if (!playOnlySelectedRange) return;
      if (selectedRange.duration() === 0) return;
      if (videoRef.current.currentTime < selectedRange.start())
        videoRef.current.currentTime = selectedRange.start();
      if (videoRef.current.currentTime > selectedRange.end()) {
        if (repeat) videoRef.current.currentTime = selectedRange.start();
        else videoRef.current.pause();
      }
    };

    const id = setInterval(listener, 0);

    return () => clearInterval(id);
  });

  return (
    <div className={styles.videoControl}>
      <Suspense fallback={'loading...'}>
        {selectedVideo ? (
          <VideoPlayer
            videoRef={videoRef}
            onEnded={onEnded}
            onLoadedData={onLoadedData}
            onPlay={onPlay}
            onPause={onPause}
            video={selectedVideo}
            className={styles.video}
          />
        ) : (
          <video className={styles.video} controls />
        )}
      </Suspense>
      <Option display={videoDuration !== 0 && !!videoRef.current}>
        <TimeSlider
          range={selectedRange}
          duration={videoDuration}
          videoRef={videoRef.current!}
          onRangeChanged={onRangeChanged}
          onVideoSeeked={onVideoSeeked}
        />
      </Option>
      <div className={styles.commandArea}>
        <ToggleButton
          onClick={setRepeat}
          isActive={repeat}
          popOver={'リピート'}
        >
          <RepeatIcon />
        </ToggleButton>
        <ToggleButton
          popOver={'ラベルの間のみ再生します'}
          onClick={setPlayOnlySelectedRange}
          isActive={playOnlySelectedRange}
        >
          <PlaySelectedRangeIcon />
        </ToggleButton>
        <IconButton
          onClick={() =>
            onRangeChanged([
              videoRef.current?.currentTime || 0,
              selectedRange.data[1],
            ])
          }
          popOver={'右向きラベルを現在の再生位置に移動します'}
        >
          <LabelLeft />
        </IconButton>
        <IconButton
          onClick={() =>
            onRangeChanged([
              selectedRange.data[0],
              videoRef.current?.currentTime || 0,
            ])
          }
          popOver={'左向きラベルを現在の再生位置に移動します'}
        >
          <LabelRight />
        </IconButton>
        <PlayStopButton playing={playing} videoRef={videoRef.current!} />

        <IconButton
          disabled={clipping}
          onClick={onSliceButtonClicked}
          popOver={'ラベルの間の範囲を切り抜きます'}
        >
          {clipping ? <CircularProgress size={24} /> : <CutIcon />}
        </IconButton>
      </div>

      <video width={320} ref={videoRef2} className={styles.video} controls />
    </div>
  );
};
