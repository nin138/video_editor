import { Ref, useCallback } from 'react';

export const classNames = (...className: (string | undefined)[]) => {
  return className.filter((it) => !!it).join(' ');
};

export const useCombinedRefs = <T extends any>(
  ...refs: Array<Ref<T>>
): Ref<T> =>
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
