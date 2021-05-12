export const removeTrailingSlash = (str: unknown): string =>
  typeof str === 'string' ? str.replace(/\/$/, '') : '';
