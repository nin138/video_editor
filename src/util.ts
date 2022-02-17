import { Ref, useCallback } from 'react';

export const classNames = (...className: (string | undefined)[]) => {
  return className.filter((it) => !!it).join(' ');
};

export const useCombinedRefs = <T extends any>(...refs: Array<Ref<T>>): Ref<T> =>
  useCallback(
    (element: T) =>
      refs.forEach((ref) => {
        if (!ref) {
          return;
        }

        if (typeof ref === 'function') {
          return ref(element);
        }

        (ref as any).current = element;
      }),
    refs
  );

export const getResource = async <T>(resource: T | Promise<T>): Promise<T> => {
  if (resource instanceof Promise) {
    return await resource;
  }
  return resource;
};

export const formatSec = (sec: number) => {
  const minutes = Math.floor(sec / 60);
  const seconds = sec % 60;

  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
};

const hexcolor = /^#?([0-9A-F]{3}|[0-9A-F]{6})$/i;
export const isHexColor = (color: string): boolean => {
  return hexcolor.test(color);
};

export type Resource<T> = { read: () => T };
export const toResource = <T>(promise: Promise<T>): Resource<T> => {
  let status = 'pending';
  let result: any;

  const suspender = promise.then(
    (r) => {
      console.log('then');
      status = 'fulfilled';
      result = r;
    },
    (e) => {
      console.log('c');
      status = 'rejected';
      result = e;
    }
  );

  const read = () => {
    if (status === 'pending') {
      throw suspender;
    } else if (status === 'rejected') {
      throw result;
    } else {
      return result;
    }
  };

  return { read };
};
