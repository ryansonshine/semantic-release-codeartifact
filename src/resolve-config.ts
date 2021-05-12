import { DEFAULT_DURATION_SECONDS } from './definitions/constants';
import { PluginConfig, VerifyConditionsContext } from './types';

export const resolveConfig = (
  pluginConfig: PluginConfig,
  { env }: VerifyConditionsContext
): PluginConfig => ({
  ...pluginConfig,
  tool: pluginConfig.tool || env.SR_CA_TOOL || '',
  domain: pluginConfig.domain || env.SR_CA_DOMAIN || '',
  domainOwner: pluginConfig.domainOwner || env.SR_CA_DOMAIN_OWNER,
  durationSeconds: +(
    pluginConfig.durationSeconds ||
    env.SR_CA_DURATION_SEC ||
    DEFAULT_DURATION_SECONDS
  ),
  repository: pluginConfig.repository || env.SR_CA_REPOSITORY || '',
});
