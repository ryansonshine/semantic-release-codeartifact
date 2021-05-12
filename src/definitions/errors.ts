/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { ErrorDefinitions } from '../types';
import { SUPPORTED_TOOL_LIST } from './constants';

const [homepage]: string = require('../../../package.json').homepage.split('#');

const linkify = (file: string): string => `${homepage}/blob/master/${file}`;

export const ERROR_DEFINITIONS: ErrorDefinitions = {
  EINVALIDTOOL: ({ tool = '' }) => ({
    message: 'Invalid CodeArtifact tool.',
    details: `The [CodeArtifact tool](${linkify(
      'README.md#codeartifact-tool'
    )}) option, if defined, must be one of '${SUPPORTED_TOOL_LIST.join("','")}'

Your configuration for the \`tool\` option is \`${tool}\``,
  }),
  ENODOMAINSET: () => ({
    message: 'No CodeArtifact domain specified.',
    details: `A [CodeArtifact domain](${linkify(
      'README.md#codeartifact-domain'
    )}) must be set in the plugin options.`,
  }),
  ENOAWSKEYID: () => ({
    message: 'No AWS access key specified.',
    details: '',
  }),
  ENOAWSREGION: () => ({
    message: 'No AWS region specified.',
    details: '',
  }),
  ENOAWSSECRETKEY: () => ({
    message: 'No AWS secret access key specified.',
    details: '',
  }),
  EMISSINGPLUGIN: ({ plugin = '', tool = '', REQUIRED_PLUGINS = [] }) => ({
    message: 'Missing plugin',
    details: `The plugin configuration is missing plugin '${plugin}' and is required for '${tool}'.

The required plugins for are: ['${REQUIRED_PLUGINS.join("','")}']`,
  }),
  EPUBLISHCONFIGMISMATCH: ({ repositoryEndpoint, publishConfig }) => ({
    message: 'Mismatch on CodeArtifact repository and publishConfig',
    details: `The registry set in the \`publishConfig\` of your package.json does not match the CodeArtifact endpoint.

The package.json \`publishConfig\` registry is ${publishConfig.registry}
The CodeArtifact endpoint is ${repositoryEndpoint}`,
  }),
  ENOAUTHTOKEN: () => ({
    message: 'No auth token returned from CodeArtifact client',
    details: '',
  }),
  ENOREPOENDPOINT: () => ({
    message: 'No endpoint returned from CodeArtifact client',
    details: '',
  }),
};
