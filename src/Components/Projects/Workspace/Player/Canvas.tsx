import React, { useEffect, useRef } from 'react';
import styles from './WsPlayer.module.css';
import { loop } from '../../../../loop';

interface Props {
  width: number;
  height: number;
}

const roundRect = function (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number
) {
  if (width < 2 * radius) radius = width / 2;
  if (height < 2 * radius) radius = height / 2;
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.arcTo(x + width, y, x + width, y + height, radius);
  ctx.arcTo(x + width, y + height, x, y + height, radius);
  ctx.arcTo(x, y + height, x, y, radius);
  ctx.arcTo(x, y, x + width, y, radius);
  ctx.closePath();
  ctx.fill();
};
const LID = 'canvas';

export const Canvas: React.VFC<Props> = ({ width, height }) => {
  const ref = useRef<HTMLCanvasElement>(null);

  const ctx = ref.current?.getContext('2d');
  const draw = () => {
    if (!ctx) return;
    ctx.fillStyle = '#f00';
    ctx.strokeStyle = '#00f';
    roundRect(ctx, 100, 50, 20, 15, 5);
    ctx.lineWidth = 2;
    ctx.fillRect(10, 10, 20, 30);
    ctx.strokeRect(50, 50, 50, 50);
  };

  useEffect(() => {
    const cb = () => {
      draw();
    };
    loop.add(LID, cb);

    return () => loop.remove(LID);
  }, [ctx, draw]);

  return (
    <>
      <button style={{ height, left: '-50px' }} onClick={draw}>
        aa
      </button>
      <canvas width={1080} height={1080} className={styles.canvas} ref={ref} style={{ width: 1000, height }}>
        www
      </canvas>
    </>
  );
};
