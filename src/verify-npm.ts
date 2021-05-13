import type SemanticReleaseError from '@semantic-release/error';
import type {
  CodeArtifactConfig,
  PluginConfig,
  VerifyConditionsContext,
} from './types';
import { resolve } from 'path';
import { appendFile } from 'fs-extra';
import readPkg from 'read-pkg';
import { getError } from './get-error';
import { removeTrailingSlash } from './util/string';

const REQUIRED_PLUGINS = ['@semantic-release/npm'];

export const verifyNpm = async (
  { tool }: PluginConfig,
  { cwd, logger, options: { plugins } }: VerifyConditionsContext,
  { authorizationToken, repositoryEndpoint }: CodeArtifactConfig,
  errors: SemanticReleaseError[]
): Promise<SemanticReleaseError[]> => {
  // Check for required plugins
  for (const plugin of REQUIRED_PLUGINS) {
    logger.log('Verifying plugin "%s" exists in config', plugin);
    if (!plugins.includes(plugin)) {
      logger.error('Missing plugin %s', plugin);
      errors.push(
        getError('EMISSINGPLUGIN', { plugin, tool, plugins, REQUIRED_PLUGINS })
      );
    }
  }

  // Check for publishConfig in package.json
  const { publishConfig = {} } = await readPkg({ cwd });

  if (publishConfig.registry) {
    logger.log(
      'Validating publishConfig registry from package.json matches CodeArtifact endpoint'
    );

    if (
      removeTrailingSlash(publishConfig.registry) !==
      removeTrailingSlash(repositoryEndpoint)
    ) {
      errors.push(
        getError('EPUBLISHCONFIGMISMATCH', {
          repositoryEndpoint,
          publishConfig,
        })
      );
      return errors;
    }
  } else {
    logger.info('Writing npmrc with CodeArtifact repository');
    const npmrc = resolve(cwd, '.npmrc');
    await appendFile(
      npmrc,
      `registry=${repositoryEndpoint}\n//${repositoryEndpoint.replace(
        /(^\w+:|^)\/\//,
        ''
      )}:always-auth=true\n`
    );
  }

  logger.info(
    'Setting process.env.NPM_TOKEN with the token retrieved from CodeArtifact'
  );
  process.env.NPM_TOKEN = authorizationToken;

  return errors;
};
