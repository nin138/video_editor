type Data = { max: number; f: (i: number) => string; d: number };

const scaleMap: Data[] = [
  {
    max: 5,
    d: 60,
    f: (i) => `${i}m`,
  },
  {
    max: 15,
    d: 15,
    f: (i) => `${i * 15}s`,
  },
  {
    max: 30,
    d: 4,
    f: (i) => `${i * 4}s`,
  },
  {
    max: 80,
    d: 1,
    f: (i) => `${i}s`,
  },
  {
    max: Infinity,
    d: 0.5,
    f: (i) => `${i / 2}s`,
  },
  {
    max: Infinity,
    d: 0.1,
    f: (i) => `${i / 10}s`,
  },
];

export const getScaleConfig = (duration: number, pxPerSec: number) => {
  const d = scaleMap.find(({ max }) => max > pxPerSec)!;
  const scale = d.d;
  const width = pxPerSec * scale;

  return {
    width,
    ite: duration / scale,
    display: d.f,
  };
};
