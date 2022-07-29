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
import { isAWSError } from './util/type-guards';
import { addProxyToClient } from 'aws-sdk-v3-proxy';

export const getCodeArtifactConfig = async (
  pluginConfig: PluginConfig,
  context: VerifyConditionsContext
): Promise<CodeArtifactConfig> => {
  const errors = [];
  const { env } = context;
  const { domain, domainOwner, tool, repository } = pluginConfig;
  try {
    const client = addProxyToClient(
      new CodeartifactClient({
        credentials: {
          accessKeyId: env.AWS_ACCESS_KEY_ID as string,
          secretAccessKey: env.AWS_SECRET_ACCESS_KEY as string,
          sessionToken: env.AWS_SESSION_TOKEN,
        },
        region: env.AWS_REGION,
      }),
      { throwOnNoProxy: false }
    );

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
    if (e instanceof AggregateError) throw e;

    if (isAWSError(e)) {
      errors.push(getError('EAWSSDK', { message: e.message, name: e.name }));
    } else {
      errors.push(
        getError('EAWSSDK', {
          name: 'UnknownException',
          message:
            'An unknown error has occured, check the logs for more details.',
        })
      );
    }

    throw new AggregateError(errors);
  }
};
