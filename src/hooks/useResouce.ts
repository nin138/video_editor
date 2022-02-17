import * as hash from 'object-hash';
import { Resource, toResource } from '../util';
import { useEffect } from 'react';

type Data<T> = {
  resource: Resource<T>;
};

const cache = new Map<string, Data<any>>();

export const useResource = <T extends (...args: any) => Promise<Result>, Result>(fn: T, ...args: Parameters<T>) => {
  const key = hash.MD5({ fn, args });

  useEffect(() => {
    return () => {
      cache.delete(key);
    };
  }, [key]);

  if (cache.has(key)) {
    return cache.get(key)?.resource.read();
  }
  const resource = toResource(fn(...args));
  cache.set(key, { resource });

  const d = cache.get(key);
  return d?.resource.read();
};
