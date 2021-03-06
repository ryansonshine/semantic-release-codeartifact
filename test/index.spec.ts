import { verifyCodeArtifact } from '../src/verify-ca-auth';
import { mocked } from 'ts-jest/utils';
import SemanticReleaseError from '@semantic-release/error';
import { verifyConditions } from '../src';
import { makePluginConfig } from './helpers/dummies';
import { getMockContext } from './mocks/mock-context';

jest.mock('../src/verify-ca-auth');

const mockVerifyCodeArtifact = mocked(verifyCodeArtifact);

describe('index', () => {
  describe('verifyConditions', () => {
    const pluginConfig = makePluginConfig();
    const mockContext = getMockContext();

    beforeEach(() => {
      jest.resetAllMocks();
    });

    it('should throw when errors are returned from verifyCodeArtifact', async () => {
      mockVerifyCodeArtifact.mockResolvedValue([
        new SemanticReleaseError('error msg', 'code', 'details'),
      ]);

      const fn = () => verifyConditions(pluginConfig, mockContext);

      await expect(fn).rejects.toThrowError();
    });

    it('should resolve when no errors are returned from verifyCodeArtifact', async () => {
      mockVerifyCodeArtifact.mockResolvedValue([]);

      const result = await verifyConditions(pluginConfig, mockContext);

      expect(result).toBeUndefined();
    });
  });
});
