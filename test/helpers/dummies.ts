import { PluginConfig } from '../../src/types';

export const makePluginConfig = (): PluginConfig => ({
  branches: ['+([0-9])?(.{+([0-9]),x}).x', 'master', 'next', 'next-major'],
  domain: 'test-domain',
  dryRun: true,
  plugins: [
    '@semantic-release/commit-analyzer',
    '@semantic-release/release-notes-generator',
    '@semantic-release/npm',
    '@semantic-release/github',
  ],
  repository: 'test-repository',
  repositoryUrl:
    'https://github.com/ryansonshine/semantic-release-codeartifact.git',
  tagFormat: 'v${version}',
  tool: 'npm',
});
