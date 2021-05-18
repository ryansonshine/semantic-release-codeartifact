import type { PluginConfig, VerifyConditionsContext } from './types';
import type SemanticReleaseError from '@semantic-release/error';
import AggregateError from 'aggregate-error';
import { resolveConfig } from './resolve-config';
import { verifyNpm } from './verify-npm';
import { verifyConfig } from './verify-config';
import { getCodeArtifactConfig } from './get-ca-config';

export const verifyCodeArtifact = async (
  pluginConfig: PluginConfig,
  context: VerifyConditionsContext
): Promise<SemanticReleaseError[]> => {
  const resolvedConfig = resolveConfig(pluginConfig, context);
  const errors = verifyConfig(resolvedConfig, context);

  if (errors.length > 0) {
    throw new AggregateError(errors);
  }

  const codeArtifactConfig = await getCodeArtifactConfig(
    resolvedConfig,
    context
  );

  return await verifyNpm(resolvedConfig, context, codeArtifactConfig, errors);
};
