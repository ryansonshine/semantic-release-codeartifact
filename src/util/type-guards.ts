import { AWSError } from '../types/errors';

export const isAWSError = (e: unknown): e is AWSError =>
  Boolean(e && e instanceof Error && (e as AWSError).$metadata !== undefined);
