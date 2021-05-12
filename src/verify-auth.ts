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
import AggregateError from 'aggregate-error';
import { resolveConfig } from './resolve-config';
import { getError } from './get-error';
import { SUPPORTED_TOOL_LIST } from './definitions/constants';
import { verifyNpm } from './verify-npm';
import SemanticReleaseError from '@semantic-release/error';

export const verifyCodeArtifact = async (
  pluginConfig: PluginConfig,
  context: VerifyConditionsContext
): Promise<SemanticReleaseError[]> => {
  const errors = [];
  const { env } = context;
  const resolvedConfig = resolveConfig(pluginConfig, context);
  const { domain, tool, repository, domainOwner } = resolvedConfig;

  if (!domain) {
    errors.push(getError('ENODOMAINSET'));
  }

  if (!SUPPORTED_TOOL_LIST.includes(tool)) {
    errors.push(getError('EINVALIDTOOL', pluginConfig));
  }

  if (!env.AWS_REGION) {
    errors.push(getError('ENOAWSREGION'));
  }

  if (!env.AWS_ACCESS_KEY_ID) {
    errors.push(getError('ENOAWSKEYID'));
  }

  if (!env.AWS_SECRET_ACCESS_KEY) {
    errors.push(getError('ENOAWSSECRETKEY'));
  }

  if (errors.length > 0) {
    throw new AggregateError(errors);
  }

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

  if (!authorizationToken || !repositoryEndpoint) {
    if (!authorizationToken) {
      errors.push(getError('ENOAUTHTOKEN'));
    }
    if (!repositoryEndpoint) {
      errors.push(getError('ENOREPOENDPOINT'));
    }
  } else {
    const codeArtifactConfig: CodeArtifactConfig = {
      authorizationToken,
      repositoryEndpoint,
    };

    await verifyNpm(resolvedConfig, context, codeArtifactConfig, errors);
  }

  return errors;
};
