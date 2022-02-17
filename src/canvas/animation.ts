export const AnimationTypes = {
  MoveTo: 'MoveTo',
} as const;

interface baseAnimation {
  startTime: number;
  endTime: number;
}

export interface MoveToAnimation extends baseAnimation {
  type: typeof AnimationTypes.MoveTo;
  toX: number;
  toY: number;
}

export type Animation = MoveToAnimation;
