import Slider from 'rc-slider/lib/Slider';
import Ranges from 'rc-slider'
import React from 'react';
import {ffmpeg} from "../ffmpeg/ffmpeg";

ffmpeg.run();

export const VideoControl = () => {
    return (
        <div className="video">
            <video src={"/test.mp4"} controls width={600} />
            <Slider />
            <Ranges />
        </div>
    );
}

