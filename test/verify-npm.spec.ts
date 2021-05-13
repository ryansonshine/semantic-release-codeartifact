import type { ErrorDefinitions, VerifyConditionsContext } from '../src/types';
import { verifyNpm } from '../src/verify-npm';
import { mocked } from 'ts-jest/utils';
import { makeCodeArtifactConfig, makePluginConfig } from './helpers/dummies';
import { mockContext } from './mocks/mock-context';
import readPkg from 'read-pkg';
import tempy from 'tempy';
import { copy, readFile } from 'fs-extra';

jest.mock('read-pkg');

const mockReadPkg = mocked(readPkg, true);
const fixtures = 'test/fixtures/files';

describe('verify-npm', () => {
  describe('verifyNpm', () => {
    const pluginConfig = makePluginConfig();
    const caConfig = makeCodeArtifactConfig();

    beforeEach(() => {
      jest.resetAllMocks();
    });

    it('should add an error when missing a plugin from the list of required plugins', async () => {
      await tempy.directory.task(async cwd => {
        await copy(fixtures, cwd);

        const contextWithoutPlugins: VerifyConditionsContext = {
          ...mockContext,
          cwd,
          options: {
            ...mockContext.options,
            plugins: [],
          },
        };
        const missingPluginCode: keyof ErrorDefinitions = 'EMISSINGPLUGIN';
        mockReadPkg.mockResolvedValue({});

        const [error, ...otherErrors] = await verifyNpm(
          pluginConfig,
          contextWithoutPlugins,
          caConfig,
          []
        );

        expect(error?.code).toEqual(missingPluginCode);
        expect(error?.name).toEqual('SemanticReleaseError');
        expect(otherErrors).toHaveLength(0);
      });
    });

    it('should add an error if the publishConfig registry exists but does not match the CA endpoint', async () => {
      const packageRegistry = 'http://publish-config-registry.local';
      const mismatchPublishCode: keyof ErrorDefinitions =
        'EPUBLISHCONFIGMISMATCH';
      mockReadPkg.mockResolvedValue({
        publishConfig: {
          registry: packageRegistry,
        },
      });

      const [error, ...otherErrors] = await verifyNpm(
        pluginConfig,
        mockContext,
        caConfig,
        []
      );

      expect(error?.code).toEqual(mismatchPublishCode);
      expect(error?.name).toEqual('SemanticReleaseError');
      expect(otherErrors).toHaveLength(0);
    });

    it('should resolve with no errors if the publishConfig registry matches the CA endpoint', async () => {
      const registry = caConfig.repositoryEndpoint;
      mockReadPkg.mockResolvedValue({ publishConfig: { registry } });

      const errors = await verifyNpm(pluginConfig, mockContext, caConfig, []);

      expect(errors).toHaveLength(0);
    });

    it('should write the registry to npmrc when no publishConfig exists', async () => {
      await tempy.directory.task(async cwd => {
        const expectedNpmrc = await readFile(`${fixtures}/.npmrc`, 'utf8');
        const contextWithCwd: VerifyConditionsContext = {
          ...mockContext,
          cwd,
        };
        mockReadPkg.mockResolvedValue({});

        await verifyNpm(pluginConfig, contextWithCwd, caConfig, []);
        const result = await readFile(`${cwd}/.npmrc`, 'utf8');

        expect(result).toEqual(expectedNpmrc);
      });
    });
  });
});
