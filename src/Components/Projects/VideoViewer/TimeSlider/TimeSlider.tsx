import React, { useContext, useState } from 'react';
import styles from './TimeSlider.module.css';
import { Scales } from './Scales';
import thumbStyle from '../../../Atoms/Range/Range.module.css';
import { DraggableScrollContainer } from '../../../Atoms/DraggableScrollContainer';
import { TimeStepSelector } from '../../../Atoms/Range/TimeStepSelector';
import scaleStyle from './Scales.module.css';
import { Slider } from '../../../Atoms/Range/Slider';
import { Range } from '../../../Atoms/Range/Range';
import { RangeData } from '../../../../entities/rangeData';

interface Props {
  duration: number;
  videoRef: HTMLVideoElement;
  onVideoSeeked: (value: number) => void;
  onRangeChanged: (values: [number, number]) => void;
  range: RangeData;
}

export enum Step {
  All,
  Min,
  TenSec,
  Sec,
}

export const stepToSec = (step: Step): number => {
  switch (step) {
    case Step.Min:
      return 60;
    case Step.TenSec:
      return 10;
    case Step.Sec:
      return 1;
    case Step.All:
      return 0;
  }
};

type CalcWidth = (duration: number, width: number) => number;

export const MARK_WIDTH = 40;

const steps: Record<Step, CalcWidth> = {
  [Step.All]: () => 0,
  [Step.Min]: (duration, width) => (duration / 60) * MARK_WIDTH,
  [Step.TenSec]: (duration, width) => (duration / 10) * MARK_WIDTH,
  [Step.Sec]: (duration, width) => duration * MARK_WIDTH,
};

export const TimeSlider: React.FC<Props> = ({ videoRef, duration, onVideoSeeked, onRangeChanged, range }) => {
  const [step, setStep] = useState(Step.All);

  const updateStep = (step: Step) => {
    if (!videoRef) return;
    setStep(step);
    setTimeout(() => {
      document
        .querySelectorAll('.' + scaleStyle.line)
        [Math.floor(videoRef.currentTime / stepToSec(step))]?.scrollIntoView({
          inline: 'center',
        });
    }, 0);
  };

  const width = steps[step](duration, 800);
  return (
    <div className={styles.wrap}>
      <TimeStepSelector step={step} onChange={updateStep} />
      <DraggableScrollContainer
        hideScrollbars={false}
        targetElementClass={scaleStyle.wrap}
        className={styles.scroll}
        ignoreElements={`${thumbStyle.sliderThumb},${thumbStyle.thumb}`}
      >
        <div className={styles.area} style={{ width: width === 0 ? '100%' : width + 'px' }}>
          <Scales width={width} duration={duration} step={step} />
          <Slider value={videoRef.currentTime} onChange={onVideoSeeked} max={duration} />

          <Range values={range.data} onChange={onRangeChanged} max={duration} />
        </div>
      </DraggableScrollContainer>
    </div>
  );
};
