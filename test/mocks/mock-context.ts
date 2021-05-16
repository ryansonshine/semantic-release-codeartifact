import { VerifyConditionsContext } from '../../src/types';

export const getMockContext = (): VerifyConditionsContext => ({
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
  env: {
    AWS_ACCESS_KEY_ID: 'test-access-key-id',
    AWS_REGION: 'test-region',
    AWS_SECRET_ACCESS_KEY: 'test-secret-access-key',
    SR_CA_TOOL: 'npm',
    SR_CA_DOMAIN: 'my-domain',
    SR_CA_DOMAIN_OWNER: '123456789',
    SR_CA_DURATION_SEC: '120',
    SR_CA_REPOSITORY: 'my-repository',
  },
  envCi: {
    branch: 'main',
    commit: '123abc',
    isCi: true,
  },
  // TODO: Appropriate mocking
  logger: {
    log: jest.fn(),
    error: jest.fn(),
    info: jest.fn(),
  } as any,
  options: {
    branches: ['main'],
    dryRun: false,
    plugins: [
      '@semantic-release/commit-analyzer',
      '@semantic-release/release-notes-generator',
      '@semantic-release/npm',
      '@semantic-release/github',
    ],
    repositoryUrl:
      'https://github.com/ryansonshine/semantic-release-codeartifact.git',
    tagFormat: 'v${version}',
  },
  // TODO: Appropriate mocking
  stderr: jest.fn() as any,
  stdout: jest.fn() as any,
});
