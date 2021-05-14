import SemanticReleaseError from '@semantic-release/error';
import AggregateError from 'aggregate-error';
import { mocked } from 'ts-jest/utils';
import { getCodeArtifactConfig } from '../src/get-ca-config';
import { resolveConfig } from '../src/resolve-config';
import { PluginConfig } from '../src/types';
import { verifyCodeArtifact } from '../src/verify-auth';
import { verifyConfig } from '../src/verify-config';
import { verifyNpm } from '../src/verify-npm';
import { makeCodeArtifactConfig, makePluginConfig } from './helpers/dummies';
import { getMockContext } from './mocks/mock-context';
jest.mock('../src/resolve-config');
jest.mock('../src/verify-config');
jest.mock('../src/get-ca-config');
jest.mock('../src/verify-npm');

const mockResolveConfig = mocked(resolveConfig, true);
const mockVerifyConfig = mocked(verifyConfig, true);
const mockGetCodeArtifactConfig = mocked(getCodeArtifactConfig, true);
const mockVerifyNpm = mocked(verifyNpm, true);

describe('verify-auth', () => {
  describe('verifyCodeArtifact', () => {
    const config = makePluginConfig();
    const context = getMockContext();
    const caConfig = makeCodeArtifactConfig();

    beforeEach(() => {
      jest.resetAllMocks();
      mockResolveConfig.mockReturnValue(config);
      mockVerifyConfig.mockReturnValue([]);
      mockGetCodeArtifactConfig.mockResolvedValue(caConfig);
    });

    it('should throw an AggregateError if configuration errors exist', async () => {
      const semanticReleaseError = new SemanticReleaseError(
        'message',
        'code',
        'details'
      );
      const aggregateError = new AggregateError([semanticReleaseError]);

      mockVerifyConfig.mockReturnValue([semanticReleaseError]);

      const fn = () => verifyCodeArtifact(config, context);

      await expect(fn).rejects.toThrowError(aggregateError);
    });

    it('should pass the resolved configuration to getCodeArtifactConfig', async () => {
      const resolvedConfig: PluginConfig = {
        ...config,
        repository: 'test-resolved-conf',
      };
      mockResolveConfig.mockReturnValue(resolvedConfig);

      await verifyCodeArtifact(resolvedConfig, context);

      expect(getCodeArtifactConfig).toHaveBeenCalledWith(
        resolvedConfig,
        context
      );
    });

    it('should return any errors returned from verifyNpm', async () => {
      const errors: SemanticReleaseError[] = [
        new SemanticReleaseError('message', 'code', 'details'),
      ];
      mockVerifyNpm.mockResolvedValue(errors);

      const result = await verifyCodeArtifact(config, context);

      expect(result).toEqual(errors);
    });
  });
});
