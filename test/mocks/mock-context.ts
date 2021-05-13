import { VerifyConditionsContext } from '../../src/types';
import logger from 'signale';
import { mocked } from 'ts-jest/utils';
import { WriteStream } from 'fs';

const stderr = (mocked(WriteStream, true) as unknown) as WriteStream;
const stdout = (mocked(WriteStream, true) as unknown) as WriteStream;

export const mockContext: VerifyConditionsContext = {
  branch: {
    name: 'main',
    type: 'release',
    tags: [{ gitTag: 'v1.0.0', version: '1.0.0', channels: [null] }],
  },
  branches: [
    {
      name: 'main',
      type: 'release',
      tags: [{ gitTag: 'v1.0.0', version: '1.0.0', channels: [null] }],
    },
  ],
  cwd: '.',
  env: {},
  envCi: {
    branch: 'main',
    commit: '123abc',
    isCi: true,
  },
  logger,
  options: {
    branches: ['main'],
    dryRun: false,
    plugins: [],
    repositoryUrl:
      'https://github.com/ryansonshine/semantic-release-codeartifact.git',
    tagFormat: 'v${version}',
  },
  stderr,
  stdout,
};
