export const DrawableTypes = {
  RectFill: 'RectFill',
  RectStroke: 'RectStroke',
} as const;

interface XYWH {
  x: number;
  y: number;
  w: number;
  h: number;
}

type Color = string;

interface Stroke {
  lineWidth: number;
}

interface DrawableBase extends XYWH {}

export interface RectFillDrawable extends DrawableBase {
  type: typeof DrawableTypes.RectFill;
  color: Color;
}

export interface RectStrokeDrawable extends DrawableBase, Stroke {
  type: typeof DrawableTypes.RectStroke;
  color: Color;
}

export type Drawable = RectFillDrawable | RectStrokeDrawable;
