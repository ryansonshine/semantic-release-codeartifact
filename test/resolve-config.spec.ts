import { DEFAULT_DURATION_SECONDS } from '../src/definitions/constants';
import { resolveConfig } from '../src/resolve-config';
import {
  PluginConfig,
  PluginConfigKey,
  VerifyConditionsContext,
} from '../src/types';
import { makePluginConfig } from './helpers/dummies';
import { getMockContext } from './mocks/mock-context';

const config = makePluginConfig();
const context = getMockContext();
const pluginConfigKeys: PluginConfigKey[] = [
  'domain',
  'domainOwner',
  'durationSeconds',
  'repository',
  'tool',
];

describe('resolve-config', () => {
  describe('resolveConfig', () => {
    it('should preserve existing, non-related plugin configurations', () => {
      const existingConfigs = { a: 'a', b: 'b', c: [] };

      const resolvedConfig = resolveConfig(
        { ...config, ...existingConfigs },
        context
      );

      expect(resolvedConfig).toEqual(expect.objectContaining(existingConfigs));
    });

    it('should resolve plugin configurations over environment variables', () => {
      expect.assertions(pluginConfigKeys.length);
      const contextWithEnv: VerifyConditionsContext = {
        ...getMockContext(),
        env: {
          SR_CA_DOMAIN: 'env-domain',
          SR_CA_DOMAIN_OWNER: 'env-domain_owner',
          SR_CA_DURATION_SEC: 'env-duration_sec',
          SR_CA_REPOSITORY: 'env-repository',
          SR_CA_TOOL: 'env-tool',
        },
      };

      const resolvedConfig = resolveConfig(config, contextWithEnv);

      for (const key of pluginConfigKeys) {
        expect(resolvedConfig[key]).toEqual(config[key]);
      }
    });

    it('should resolve enviornment variables when plugin configurations do not exist', () => {
      const configWithoutOptions: PluginConfig = {
        ...makePluginConfig(),
        // @ts-expect-error
        domain: undefined,
        domainOwner: undefined,
        durationSeconds: undefined,
        // @ts-expect-error
        repository: undefined,
        // @ts-expect-error
        tool: undefined,
      };
      const env = {
        SR_CA_DOMAIN: 'env-domain',
        SR_CA_DOMAIN_OWNER: 'env-domain_owner',
        SR_CA_DURATION_SEC: '99999999',
        SR_CA_REPOSITORY: 'env-repository',
        SR_CA_TOOL: 'env-tool',
      };
      const contextWithEnv: VerifyConditionsContext = {
        ...getMockContext(),
        env,
      };

      const resolvedConfig = resolveConfig(
        configWithoutOptions,
        contextWithEnv
      );

      expect(resolvedConfig.domain).toEqual(env.SR_CA_DOMAIN);
      expect(resolvedConfig.domainOwner).toEqual(env.SR_CA_DOMAIN_OWNER);
      expect(resolvedConfig.durationSeconds).toEqual(+env.SR_CA_DURATION_SEC);
      expect(resolvedConfig.repository).toEqual(env.SR_CA_REPOSITORY);
      expect(resolvedConfig.tool).toEqual(env.SR_CA_TOOL);
    });

    it('should resolve default values when no config options or env vars are set', () => {
      const configWithoutOptions: PluginConfig = {
        ...makePluginConfig(),
        // @ts-expect-error
        domain: undefined,
        domainOwner: undefined,
        durationSeconds: undefined,
        // @ts-expect-error
        repository: undefined,
        // @ts-expect-error
        tool: undefined,
      };
      const contextWithoutEnv: VerifyConditionsContext = {
        ...getMockContext(),
        env: {},
      };

      const resolvedConfig = resolveConfig(
        configWithoutOptions,
        contextWithoutEnv
      );

      expect(resolvedConfig.tool).toEqual('');
      expect(resolvedConfig.domain).toEqual('');
      expect(resolvedConfig.domainOwner).toBeUndefined();
      expect(resolvedConfig.durationSeconds).toEqual(DEFAULT_DURATION_SECONDS);
      expect(resolvedConfig.repository).toEqual('');
    });
  });
});
