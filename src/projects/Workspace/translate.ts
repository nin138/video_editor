export const calcTransform = (time: number, pxPerSec: number) => `translate(${time * pxPerSec}px)`;
