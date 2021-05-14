import { readFile } from 'fs-extra';
import { getRegistryFromNpmrc } from '../../src/util/npmrc';

const fixtures = 'test/fixtures/files';
const RE_URL = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/;

describe('npmrc', () => {
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
  });
});
