import React, { useEffect, useRef, useState } from 'react';
import { PlayStopButton } from '../../Atoms/Button/PlayStopButton';
import { loop2 } from '../../../loop';
import { Node } from '../../../canvas/node';
import { dc } from '../../../canvas/drawableFactory';
import { renderNodes } from '../../../canvas/drawableRenderer';

interface Props {
  duration: number;
}

const LID = 'CVideo';

const nodes: Node[] = [
  {
    drawable: dc.RectStroke({ x: 10, y: 20, h: 20, w: 50, lineWidth: 2, color: '#f00' }),
    animations: [],
    startTime: 2,
    endTime: 5,
  },
  {
    drawable: dc.RectFill({ x: 50, y: 120, h: 40, w: 150, color: '#00F' }),
    animations: [
      {
        type: 'MoveTo',
        startTime: 2,
        endTime: 5,
        toX: 300,
        toY: 400,
      },
    ],
    startTime: 1,
    endTime: 7,
  },
];
const loop = loop2;

export const CanvasVideo: React.VFC<Props> = ({ duration }) => {
  const [playing, setPlaying] = useState(false);

  const canvas = useRef<HTMLCanvasElement>(null);
  const start = Date.now();
  const ctx = canvas.current?.getContext('2d');
  const draw = () => {
    if (!ctx) return;
    const currentTime = (Date.now() - start) / 1000;
    ctx.clearRect(0, 0, 1000, 800);
    renderNodes(ctx, currentTime, nodes);
  };

  const startLoop = () => loop.add(LID, draw);

  return (
    <div>
      <canvas style={{ background: '#fff' }} width={1000} height={800} ref={canvas} />
      <PlayStopButton
        playing={playing}
        onClick={() => {
          if (playing) loop.remove(LID);
          else loop.add(LID, startLoop);
          setPlaying(!playing);
        }}
      />
    </div>
  );
};
