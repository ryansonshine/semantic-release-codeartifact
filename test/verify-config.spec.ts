import {
  ErrorDefinitions,
  PluginConfig,
  VerifyConditionsContext,
} from '../src/types';
import { verifyConfig } from '../src/verify-config';
import { makePluginConfig } from './helpers/dummies';
import { getMockContext } from './mocks/mock-context';

describe('verify-config', () => {
  describe('verifyConfig', () => {
    let config: PluginConfig;
    let context: VerifyConditionsContext;
    beforeEach(() => {
      config = makePluginConfig();
      context = getMockContext();
    });

    it('should return a SemanticRelease error if domain is not set', () => {
      // @ts-expect-error
      config.domain = undefined;

      const [error, ...otherErrors] = verifyConfig(config, context);

      expect(error?.code).toEqual<keyof ErrorDefinitions>('ENODOMAINSET');
      expect(error?.name).toEqual('SemanticReleaseError');
      expect(otherErrors).toHaveLength(0);
    });

    it('should return a SemanticRelease error if repository is not set', () => {
      // @ts-expect-error
      config.repository = undefined;

      const [error, ...otherErrors] = verifyConfig(config, context);

      expect(error?.code).toEqual<keyof ErrorDefinitions>('ENOREPOSET');
      expect(error?.name).toEqual('SemanticReleaseError');
      expect(otherErrors).toHaveLength(0);
    });

    it('should return a SemanticRelease error if an invalid tool is provided', () => {
      config.tool = 'not-supported';

      const [error, ...otherErrors] = verifyConfig(config, context);

      expect(error?.code).toEqual<keyof ErrorDefinitions>('EINVALIDTOOL');
      expect(error?.name).toEqual('SemanticReleaseError');
      expect(otherErrors).toHaveLength(0);
    });

    it('should return a SemanticRelease error if tool is not set', () => {
      // @ts-expect-error
      config.tool = undefined;

      const [error, ...otherErrors] = verifyConfig(config, context);

      expect(error?.code).toEqual<keyof ErrorDefinitions>('EINVALIDTOOL');
      expect(error?.name).toEqual('SemanticReleaseError');
      expect(otherErrors).toHaveLength(0);
    });

    it('should return a SemanticRelease error if AWS_REGION is not set', () => {
      context.env.AWS_REGION = undefined;

      const [error, ...otherErrors] = verifyConfig(config, context);

      expect(error?.code).toEqual<keyof ErrorDefinitions>('ENOAWSREGION');
      expect(error?.name).toEqual('SemanticReleaseError');
      expect(otherErrors).toHaveLength(0);
    });

    it('should return a SemanticRelease error if AWS_ACCESS_KEY_ID is not set', () => {
      context.env.AWS_ACCESS_KEY_ID = undefined;

      const [error, ...otherErrors] = verifyConfig(config, context);

      expect(error?.code).toEqual<keyof ErrorDefinitions>('ENOAWSKEYID');
      expect(error?.name).toEqual('SemanticReleaseError');
      expect(otherErrors).toHaveLength(0);
    });

    it('should return a SemanticRelease error if AWS_SECRET_ACCESS_KEY is not set', () => {
      context.env.AWS_SECRET_ACCESS_KEY = undefined;

      const [error, ...otherErrors] = verifyConfig(config, context);

      expect(error?.code).toEqual<keyof ErrorDefinitions>('ENOAWSSECRETKEY');
      expect(error?.name).toEqual('SemanticReleaseError');
      expect(otherErrors).toHaveLength(0);
    });
  });
});
