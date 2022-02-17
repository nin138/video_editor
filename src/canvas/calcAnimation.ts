import { Drawable } from './drawable';
import { Animation, AnimationTypes, MoveToAnimation } from './animation';

const calcMoveTo = (d: Drawable, anime: MoveToAnimation, currentTime: number): Drawable => {
  if (currentTime < anime.startTime) return d;
  const duration = anime.endTime - anime.startTime;
  const ratio = anime.endTime < currentTime ? 1 : (currentTime - anime.startTime) / duration;
  const diffX = anime.toX - d.x;
  const diffY = anime.toY - d.y;
  return {
    ...d,
    x: d.x + diffX * ratio,
    y: d.y + diffY * ratio,
  };
};

export const calcAnimation = (d: Drawable, anime: Animation, currentTime: number): Drawable => {
  switch (anime.type) {
    case AnimationTypes.MoveTo: {
      return calcMoveTo(d, anime, currentTime);
    }
  }
};
