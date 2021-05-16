import type { PluginConfig, VerifyConditionsContext } from './types';
import type SemanticReleaseError from '@semantic-release/error';
import { SUPPORTED_TOOL_LIST } from './definitions/constants';
import { getError } from './get-error';

export const verifyConfig = (
  pluginConfig: PluginConfig,
  context: VerifyConditionsContext
): SemanticReleaseError[] => {
  const errors = [];
  const { domain, tool, repository } = pluginConfig;
  const { env } = context;

  if (!domain) {
    errors.push(getError('ENODOMAINSET'));
  }

  if (!repository) {
    errors.push(getError('ENOREPOSET'));
  }

  if (!SUPPORTED_TOOL_LIST.includes(tool)) {
    errors.push(getError('EINVALIDTOOL', pluginConfig));
  }

  if (!env.AWS_REGION) {
    errors.push(getError('ENOAWSREGION'));
  }

  if (!env.AWS_ACCESS_KEY_ID) {
    errors.push(getError('ENOAWSACCESSKEY'));
  }

  if (!env.AWS_SECRET_ACCESS_KEY) {
    errors.push(getError('ENOAWSSECRETKEY'));
  }

  return errors;
};
