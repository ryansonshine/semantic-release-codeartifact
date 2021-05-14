import { CodeArtifactConfig, PluginConfig } from '../../src/types';

export const makePluginConfig = (
  overrides: Partial<PluginConfig> = {}
): PluginConfig => ({
  branches: ['+([0-9])?(.{+([0-9]),x}).x', 'master', 'next', 'next-major'],
  domain: 'test-domain',
  dryRun: true,
  plugins: [],
  repository: 'test-repository',
  repositoryUrl:
    'https://github.com/ryansonshine/semantic-release-codeartifact.git',
  tagFormat: 'v${version}',
  tool: 'npm',
  ...overrides,
});

export const makeCodeArtifactConfig = (
  overrides: Partial<CodeArtifactConfig> = {}
): CodeArtifactConfig => ({
  authorizationToken: '16b1690f-4a51-4e2f-a9d6-ff5b0ec1189f-test-auth-token',
  repositoryEndpoint:
    'https://my-domain-000000000.d.codeartifact.us-east-1.amazonaws.com/npm/my-repo/',
  ...overrides,
});
