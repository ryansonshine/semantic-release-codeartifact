import SemanticReleaseError from '@semantic-release/error';
import { ERROR_DEFINITIONS } from './definitions/errors';
import { ErrorDefinitions, PluginConfig } from './types';

export const getError = (
  code: keyof ErrorDefinitions,
  args: PluginConfig | Record<string, any> = {}
): SemanticReleaseError => {
  const { message, details } = ERROR_DEFINITIONS[code](args);
  return new SemanticReleaseError(message, code, details);
};
