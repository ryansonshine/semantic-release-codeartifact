import type SemanticReleaseError from '@semantic-release/error';
import type {
  CodeArtifactConfig,
  PluginConfig,
  VerifyConditionsContext,
} from './types';
import { resolve } from 'path';
import { appendFile, pathExists, readFile, writeFile } from 'fs-extra';
import readPkg from 'read-pkg';
import { getError } from './get-error';
import { isUrlMatch } from './util/url';
import { getRegistryFromNpmrc } from './util/npmrc';
import { verifyPlugins } from './verify-plugins';

const REQUIRED_PLUGINS = ['@semantic-release/npm'];

export const verifyNpm = async (
  pluginConfig: PluginConfig,
  context: VerifyConditionsContext,
  { authorizationToken, repositoryEndpoint }: CodeArtifactConfig,
  errors: SemanticReleaseError[]
): Promise<SemanticReleaseError[]> => {
  const { cwd, logger } = context;

  const { publishConfig = {} } = await readPkg({ cwd });
  const npmrcPath = resolve(cwd, '.npmrc');

  verifyPlugins(pluginConfig, context, REQUIRED_PLUGINS, errors);

  if (publishConfig.registry) {
    logger.log(
      'Validating `publishConfig.registry` from `package.json` matches CodeArtifact endpoint'
    );

    if (!isUrlMatch(publishConfig.registry, repositoryEndpoint)) {
      errors.push(
        getError('EPUBLISHCONFIGMISMATCH', {
          repositoryEndpoint,
          publishConfig,
        })
      );
      return errors;
    }

    logger.log(
      'Validated `publishConfig.registry` matches CodeArtifact endpoint %s',
      repositoryEndpoint
    );
  }

  if (await pathExists(npmrcPath)) {
    logger.log('Validating `.npmrc` matches CodeArtifact endpoint');
    const npmrc = await readFile(npmrcPath, 'utf8');
    const [registry, ...otherRegistries] = getRegistryFromNpmrc(npmrc);

    // npmrc exists but no registries are listed
    if (registry) {
      if (otherRegistries.length) {
        errors.push(
          getError('ENPMRCMULTIPLEREGISTRY', {
            registries: [registry, ...otherRegistries],
          })
        );
      }

      if (!isUrlMatch(registry, repositoryEndpoint)) {
        errors.push(
          getError('ENPMRCCONFIGMISMATCH', { repositoryEndpoint, registry })
        );
      }
    } else {
      // append to existing npmrc
      logger.log(
        'No registry found in existing `.npmrc`, appending CodeArtifact registry'
      );
      await appendFile(
        npmrcPath,
        `\nregistry=${repositoryEndpoint}\n//${repositoryEndpoint.replace(
          /(^\w+:|^)\/\//,
          ''
        )}:always-auth=true\n`
      );
    }
  } else {
    // If no .npmrc exists, create one
    await writeFile(
      npmrcPath,
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
