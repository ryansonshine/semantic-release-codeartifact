import { readFile } from 'fs-extra';
import {
  getRegistryFromNpmrc,
  replaceEnvVarsInNpmrc,
} from '../../src/util/npmrc';

const fixtures = 'test/fixtures/files';
const RE_URL = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/;

describe('npmrc', () => {
  const PREV_ENV = process.env;

  beforeEach(() => {
    process.env = { ...PREV_ENV };
  });

  afterEach(() => {
    process.env = PREV_ENV;
  });

  describe('getRegistryFromNpmrc', () => {
    it('should handle a single registry npmrc file', async () => {
      const singleRegistry = await readFile(`${fixtures}/.npmrc`, 'utf8');

      const [registry, ...otherRegistries] = getRegistryFromNpmrc(
        singleRegistry
      );

      expect(registry).toMatch(RE_URL);
      expect(otherRegistries).toHaveLength(0);
    });

    it('should handle a scoped registry npmrc file', async () => {
      const scopedRegistry = await readFile(`${fixtures}/scoped.npmrc`, 'utf8');

      const [registry, ...otherRegistries] = getRegistryFromNpmrc(
        scopedRegistry
      );

      expect(registry).toMatch(RE_URL);
      expect(otherRegistries).toHaveLength(0);
    });

    it('should not throw when an undefined value is passed in', () => {
      const registry = getRegistryFromNpmrc();

      expect(registry).toEqual([]);
    });
  });

  describe('replaceEnvVarsInNpmrc', () => {
    it('should substitute an environment variables with the value on process.env', async () => {
      const accountId = '123456789012';
      const region = 'us-east-1';
      const expectedUrl = `https://my-domain-${accountId}.d.codeartifact.${region}.amazonaws.com/npm/my-repo/`;
      process.env.AWS_ACCOUNT_ID = accountId;
      process.env.AWS_REGION = region;
      const npmrc = await readFile(`${fixtures}/envvars.npmrc`, 'utf8');

      const formattedNpmrc = replaceEnvVarsInNpmrc(npmrc);

      expect(formattedNpmrc).toEqual(expect.stringContaining(expectedUrl));
    });

    it('should return the same string if no environment variables are present', async () => {
      const npmrc = await readFile(`${fixtures}/.npmrc`, 'utf8');

      const formattedNpmrc = replaceEnvVarsInNpmrc(npmrc);

      expect(formattedNpmrc).toEqual(npmrc);
    });

    it('should not throw when an undefined value is passed in', () => {
      const formattedNpmrc = replaceEnvVarsInNpmrc();

      expect(formattedNpmrc).toEqual('');
    });
  });
});
