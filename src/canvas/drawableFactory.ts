import { DrawableTypes, RectFillDrawable, RectStrokeDrawable } from './drawable';

export const dc = {
  [DrawableTypes.RectStroke]: (d: Omit<RectStrokeDrawable, 'type'>): RectStrokeDrawable => ({
    type: DrawableTypes.RectStroke,
    ...d,
  }),
  [DrawableTypes.RectFill]: (d: Omit<RectFillDrawable, 'type'>): RectFillDrawable => ({
    type: DrawableTypes.RectFill,
    ...d,
  }),
} as const;
