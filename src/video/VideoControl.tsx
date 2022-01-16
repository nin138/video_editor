import './VideoControl.css';
import React, {MutableRefObject, ReactEventHandler, useEffect, useLayoutEffect, useRef, useState} from 'react';
import {getFFmpeg} from "../ffmpeg/ffmpeg";
import {Range} from "react-range";
import {SliderThumb, SliderTrack} from "./SliderItem";
import {ToggleButton} from "../atoms/ToggleButton";
import {Option} from "../atoms/Option";

class RangeData {
    private _data: [number, number];

    public get data() {
        return this._data;
    }

    constructor(data: [number, number]) {
        this._data = data;
    }

    update(data: [number, number]) {
        return new RangeData(data);
        this._data = data;
        return this;
    }

    start() {
        return this.data.sort()[0];
    }

    end() {
        return this.data.sort()[1];
    }

    duration() {
        return this.end() - this.start();
    }
}

export const VideoControl = () => {


    const [videoDuration, setVideoDuration] = useState(0);
    const [currentTime, setCurrentTime] = useState([0]);

    const [selectedRange, setSelectedRange] = useState(new RangeData([0, 0]));

    // const selectedRange: MutableRefObject<[number, number]> = useRef([0, 0]);

    const [repeat, setRepeat] = useState(false);
    const [playOnlySelectedRange, setPlayOnlySelectedRange] = useState(false);

    const videoRef: MutableRefObject<HTMLVideoElement | null> = React.useRef(null);

    const onReady = (ref: HTMLVideoElement) => {
        console.log("ready");
        setVideoDuration(ref.duration);
        ref.volume = 0.1;
    }

    const onLoadedData: ReactEventHandler<HTMLVideoElement> = (element) => {
        if(element.currentTarget.readyState >= 2) {
            onReady(element.currentTarget);
        }
    }

    const onSliderChanged: (value: number) => void = (value) => {
        if(!videoRef.current) return;
        console.log(value);
        videoRef.current.currentTime = value;
    };

    const onVideoSeeked = (values: number[]) => {
        setCurrentTime(values);
        if(videoRef.current) videoRef.current.currentTime = values[0];
    };

    const onRangeChanged: (values: number[]) => void = (values) => {
        if(!videoRef.current) return;

        console.log(values);
        setSelectedRange(selectedRange.update(values as [number, number]));
    };

    const videoRef2: MutableRefObject<HTMLVideoElement | null> = React.useRef(null);
    const onSliceButtonClicked = () => {
        console.log("c");
        getFFmpeg().then(async it => {
            console.log(1);
            const fileName = 'test.mp4';
            const outFileName = '/out.mp4';
            await it.writeFileFromURL('/test.mp4', fileName)
            console.log(2);
            await it.sliceVideo(selectedRange.start(), selectedRange.end(), fileName, outFileName);
            const data = await it.readFile(outFileName);

            console.log(3);

            videoRef2.current!.src = URL.createObjectURL(new Blob([data.buffer]));

            console.log(5);
        })
    };

    const onEnded = () => {
        if(repeat && videoRef.current) {
            videoRef.current.currentTime = 0;
            videoRef.current.play();
        }
    }

    const onPlay = () => {
        if(playOnlySelectedRange && videoRef.current && videoRef.current.currentTime > selectedRange.end()) {
            videoRef.current.currentTime = selectedRange.start();
        }
    }

    useEffect(() => {
       const listener = () => {
           if(!videoRef.current || videoRef.current.readyState <= 2) return;
           setCurrentTime([videoRef.current.currentTime]);
           if(!playOnlySelectedRange) return;
           if(selectedRange.duration() === 0) return;
           if(videoRef.current.currentTime < selectedRange.start()) videoRef.current.currentTime = selectedRange.start();
           if(videoRef.current.currentTime > selectedRange.end()) {
               if(repeat) videoRef.current.currentTime = selectedRange.start();
               else videoRef.current.pause();
           }
       };

       const id = setInterval(listener, 0);

        return () => clearInterval(id);
    });

    return (
        <div className="videoControl">
            <video
                ref={videoRef}
                onEnded={onEnded}
                onLoadedData={onLoadedData}
                onPlay={onPlay}
                src={"/test.mp4"}
                controls
                className={"video"} />
            <Option display={videoDuration != 0}>

            <Range values={currentTime}
                   onChange={onVideoSeeked}
                   min={0}
                   max={videoDuration}
                   renderTrack={({ props, children }) => (<SliderTrack props={props} children={children} />)}
                   renderThumb={SliderThumb}
            />
            
            <Range values={selectedRange.data}
                   onChange={onRangeChanged}
                   min={0}
                   max={videoDuration}
                   allowOverlap
                   renderTrack={({ props, children }) => (<SliderTrack props={props} children={children} />)}
                   renderThumb={SliderThumb} />
            {/*<Range min={0} max={videoDuration} count={1} allowCross={true} step={0.1} onAfterChange={onRangeChanged} />*/}
            </Option>
            <button onClick={onSliceButtonClicked}>slice</button>
            <div>
                <ToggleButton onClick={setRepeat} isActive={repeat}>
                    repeat
                </ToggleButton>
                <ToggleButton onClick={setPlayOnlySelectedRange} isActive={playOnlySelectedRange}>
                    play selected range
                </ToggleButton>
            </div>

            <video ref={videoRef2} className={'video'} controls> </video>
        </div>
    );
}

