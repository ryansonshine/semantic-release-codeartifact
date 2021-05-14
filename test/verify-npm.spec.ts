import type { ErrorDefinitions, VerifyConditionsContext } from '../src/types';
import { verifyNpm } from '../src/verify-npm';
import { mocked } from 'ts-jest/utils';
import { makeCodeArtifactConfig, makePluginConfig } from './helpers/dummies';
import { getMockContext } from './mocks/mock-context';
import readPkg from 'read-pkg';
import tempy from 'tempy';
import { copy, readFile, writeFile } from 'fs-extra';

jest.mock('read-pkg');

const mockReadPkg = mocked(readPkg, true);
const fixtures = 'test/fixtures/files';

describe('verify-npm', () => {
  describe('verifyNpm', () => {
    const pluginConfig = makePluginConfig();
    const caConfig = makeCodeArtifactConfig();
    const mockContext = getMockContext();

    beforeEach(() => {
      jest.resetAllMocks();
      mockReadPkg.mockResolvedValue({});
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

        const [error] = await verifyNpm(
          pluginConfig,
          contextWithoutPlugins,
          caConfig,
          []
        );

        expect(error?.code).toEqual(missingPluginCode);
        expect(error?.name).toEqual('SemanticReleaseError');
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
      await tempy.directory.task(async cwd => {
        const registry = caConfig.repositoryEndpoint;
        mockReadPkg.mockResolvedValue({ publishConfig: { registry } });

        const errors = await verifyNpm(
          pluginConfig,
          { ...mockContext, cwd },
          caConfig,
          []
        );

        expect(errors).toHaveLength(0);
      });
    });

    it('should add an error if multiple registries exist in the existing npmrc', async () => {
      await tempy.directory.task(async cwd => {
        const multipleRegistryCode: keyof ErrorDefinitions =
          'ENPMRCMULTIPLEREGISTRY';
        await copy(`${fixtures}/multiregistry.npmrc`, `${cwd}/.npmrc`);

        const [error, ...otherErrors] = await verifyNpm(
          pluginConfig,
          { ...mockContext, cwd },
          caConfig,
          []
        );

        expect(error.code).toEqual(multipleRegistryCode);
        expect(error.name).toEqual('SemanticReleaseError');
        expect(otherErrors).toHaveLength(0);
      });
    });

    it('should add an error if npmrc exists and the registry does not match the CA endpoint', async () => {
      await tempy.directory.task(async cwd => {
        const mismatchNpmrcCode: keyof ErrorDefinitions =
          'ENPMRCCONFIGMISMATCH';
        const caMismatchConfig = makeCodeArtifactConfig({
          repositoryEndpoint: 'https://not-a-match.local/',
        });
        await copy(fixtures, cwd);

        const [error, ...otherErrors] = await verifyNpm(
          pluginConfig,
          { ...mockContext, cwd },
          caMismatchConfig,
          []
        );

        expect(error?.code).toEqual(mismatchNpmrcCode);
        expect(error?.name).toEqual('SemanticReleaseError');
        expect(otherErrors).toHaveLength(0);
      });
    });

    it('should write the registry to npmrc when no publishConfig exists and an npmrc exists but contains no registry', async () => {
      await tempy.directory.task(async cwd => {
        const npmrc = `${cwd}/.npmrc`;
        const npmrcContents =
          '//my-unrelated-registry.local/:always-auth=true\n';
        const expected = await readFile(`${fixtures}/.npmrc`, 'utf8');

        await writeFile(npmrc, npmrcContents);

        const errors = await verifyNpm(
          pluginConfig,
          { ...mockContext, cwd },
          caConfig,
          []
        );
        const result = await readFile(npmrc, 'utf8');

        expect(result.split('\n')).toContain(expected.split('\n')[0]);
        expect(errors).toHaveLength(0);
      });
    });

    it('should not write to npmrc if npmrc exists and has a matching registry', async () => {
      await tempy.directory.task(async cwd => {
        const npmrc = `${cwd}/.npmrc`;
        const npmrcContents = `registry=${caConfig.repositoryEndpoint}`;
        await writeFile(npmrc, npmrcContents);

        const errors = await verifyNpm(
          pluginConfig,
          { ...mockContext, cwd },
          caConfig,
          []
        );
        const result = await readFile(npmrc, 'utf8');

        expect(result).toEqual(npmrcContents);
        expect(errors).toHaveLength(0);
      });
    });

    it('should write the registry to npmrc when no publishConfig exists and no npmrc exists', async () => {
      await tempy.directory.task(async cwd => {
        const expectedNpmrc = await readFile(`${fixtures}/.npmrc`, 'utf8');

        await verifyNpm(pluginConfig, { ...mockContext, cwd }, caConfig, []);
        const result = await readFile(`${cwd}/.npmrc`, 'utf8');

        expect(result).toEqual(expectedNpmrc);
      });
    });
  });
});
