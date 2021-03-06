import type { PluginConfig, VerifyConditionsContext } from './types';
import { verifyCodeArtifact } from './verify-ca-auth';
import AggregateError from 'aggregate-error';

export async function verifyConditions(
  pluginConfig: PluginConfig,
  context: VerifyConditionsContext
): Promise<void> {
  const errors = await verifyCodeArtifact(pluginConfig, context);

  if (errors.length > 0) {
    throw new AggregateError(errors);
  }
}
