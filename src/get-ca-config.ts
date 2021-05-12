import type {
  CodeArtifactConfig,
  PluginConfig,
  VerifyConditionsContext,
} from './types';
import {
  CodeartifactClient,
  GetAuthorizationTokenCommand,
  GetRepositoryEndpointCommand,
} from '@aws-sdk/client-codeartifact';
import { getError } from './get-error';
import AggregateError from 'aggregate-error';

export const getCodeArtifactConfig = async (
  pluginConfig: PluginConfig,
  context: VerifyConditionsContext
): Promise<CodeArtifactConfig> => {
  const errors = [];
  const { env, logger } = context;
  const { domain, domainOwner, tool, repository } = pluginConfig;
  try {
    const client = new CodeartifactClient({
      credentials: {
        accessKeyId: env.AWS_ACCESS_KEY_ID as string,
        secretAccessKey: env.AWS_SECRET_ACCESS_KEY as string,
      },
      region: env.AWS_REGION,
    });

    const getTokenCmd = new GetAuthorizationTokenCommand({
      domain,
      domainOwner,
    });
    const { authorizationToken = '' } = await client.send(getTokenCmd);

    const getEndpointCmd = new GetRepositoryEndpointCommand({
      domain,
      format: tool,
      repository,
      domainOwner,
    });
    const { repositoryEndpoint = '' } = await client.send(getEndpointCmd);

    if (!authorizationToken) {
      errors.push(getError('ENOAUTHTOKEN'));
    }
    if (!repositoryEndpoint) {
      errors.push(getError('ENOREPOENDPOINT'));
    }

    if (errors.length > 0) {
      throw new AggregateError(errors);
    }

    return { authorizationToken, repositoryEndpoint };
  } catch (e) {
    // TODO: handle aws sdk error
    logger.error('Failed to get CodeArtifact credentials');
    throw e;
  }
};
