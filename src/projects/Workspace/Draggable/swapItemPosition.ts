import { WsVideoItem } from '../../../entities/workspace';

export const swapPosition = (item1: WsVideoItem, item2: WsVideoItem): [WsVideoItem, WsVideoItem] => {
  const toLr = (item1: WsVideoItem, item2: WsVideoItem) =>
    item1.startTime < item2.startTime ? [item1, item2] : [item2, item1];
  const [l, r] = toLr(item1, item2);

  return [
    { ...l, startTime: l.startTime + r.duration },
    { ...r, startTime: l.startTime },
  ];
};
