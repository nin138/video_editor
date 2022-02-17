import { Drawable, DrawableTypes } from './drawable';
import { Node } from './node';
import { calcAnimation } from './calcAnimation';

const types = DrawableTypes;

export const renderDrawable = (ctx: CanvasRenderingContext2D, drawable: Drawable) => {
  const { x, y, w, h, color } = drawable;
  switch (drawable.type) {
    case types.RectStroke: {
      ctx.strokeStyle = color;
      ctx.strokeRect(x, y, w, h);
      return;
    }
    case types.RectFill: {
      ctx.fillStyle = color;
      ctx.fillRect(x, y, w, h);
      return;
    }
  }
  throw new Error('Not IMPL');
};

export const calcNode = (node: Node, currentTime: number): Drawable | undefined => {
  if (node.startTime > currentTime || node.endTime < currentTime) return;

  return node.animations.reduce((prev, anime) => {
    return calcAnimation(prev, anime, currentTime);
  }, node.drawable);
};

const renderNode = (ctx: CanvasRenderingContext2D, currentTime: number, node: Node) => {
  const drawable = calcNode(node, currentTime);
  if (!drawable) return;
  renderDrawable(ctx, drawable);
};

export const renderNodes = (ctx: CanvasRenderingContext2D, currentTime: number, nodes: Node[]) => {
  nodes.forEach((it) => renderNode(ctx, currentTime, it));
};
