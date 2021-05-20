import type SemanticReleaseError from '@semantic-release/error';
import { getError } from './get-error';
import { PluginConfig, VerifyConditionsContext } from './types';

export const verifyPlugins = (
  pluginConfig: PluginConfig,
  { logger, options: { plugins } }: VerifyConditionsContext,
  requiredPlugins: string[],
  errors: SemanticReleaseError[]
): SemanticReleaseError[] => {
  const { skipPluginCheck, tool } = pluginConfig;

  if (skipPluginCheck) {
    logger.info('Skipping plugin check: skipPluginCheck is true');
    return errors;
  }

  for (const plugin of requiredPlugins) {
    logger.log('Verifying plugin "%s" exists in config', plugin);
    if (!plugins.includes(plugin)) {
      logger.error('Missing plugin %s', plugin);
      errors.push(
        getError('EMISSINGPLUGIN', { plugin, tool, plugins, requiredPlugins })
      );
    }
  }

  return errors;
};
