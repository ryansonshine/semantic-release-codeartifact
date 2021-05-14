import { removeTrailingSlash } from './string';

export const isUrlMatch = (url1: unknown, url2: unknown): boolean =>
  typeof url1 === 'string' &&
  typeof url2 === 'string' &&
  removeTrailingSlash(url1) === removeTrailingSlash(url2);
