/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { ErrorDefinitions } from '../types';
import { SUPPORTED_TOOL_LIST } from './constants';

const [homepage]: string = require('../../../package.json').homepage.split('#');

const linkify = (file: string): string => `${homepage}/blob/main/${file}`;

export const ERROR_DEFINITIONS: ErrorDefinitions = {
  EINVALIDTOOL: ({ tool = '' }) => ({
    message: 'Invalid CodeArtifact tool.',
    details: `The [CodeArtifact tool](${linkify(
      'README.md#codeartifact-tool'
    )}) option, if defined, must be one of '${SUPPORTED_TOOL_LIST.join("','")}'.

Your configuration for the \`tool\` option is \`${tool}\`.`,
  }),
  ENODOMAINSET: () => ({
    message: 'No CodeArtifact domain specified.',
    details: `A [CodeArtifact domain](${linkify(
      'README.md#options'
    )}) must be set in the plugin options.`,
  }),
  ENOREPOSET: () => ({
    message: 'No CodeArtifact repository specified.',
    details: `A [CodeArtifact repository](${linkify(
      'README.md#options'
    )}) must be set in the plugin options.`,
  }),
  ENOAWSKEYID: () => ({
    message: 'No AWS access key specified.',
    details: `An [AWS Access Key ID](https://docs.aws.amazon.com/general/latest/gr/glos-chap.html#accesskeyID) must be specified to get an auth token from CodeArtifact.

Please make sure to set the \`AWS_ACCESS_KEY_ID\` environment variable in your CI environment.
See [AWS Environment variables](${linkify(
      'README.md#aws-environment-variables'
    )}) for more details.`,
  }),
  ENOAWSREGION: () => ({
    message: 'No AWS region specified.',
    details: `An [AWS Region](https://docs.aws.amazon.com/general/latest/gr/glos-chap.html#region) must be specified to get an auth token from CodeArtifact.

Please make sure to set the \`AWS_REGION\` environment variable in your CI environment.
See [AWS Environment variables](${linkify(
      'README.md#aws-environment-variables'
    )}) for more details.`,
  }),
  ENOAWSSECRETKEY: () => ({
    message: 'No AWS secret access key specified.',
    details: `An [AWS Secret Access Key](https://docs.aws.amazon.com/general/latest/gr/glos-chap.html#SecretAccessKey) must be specified to get an auth token from CodeArtifact.

Please make sure to set the \`AWS_SECRET_ACCESS_KEY\` environment variable in your CI environment.
See [AWS Environment variables](${linkify(
      'README.md#aws-environment-variables'
    )}) for more details.`,
  }),
  EMISSINGPLUGIN: ({ plugin = '', tool = '', REQUIRED_PLUGINS = [] }) => ({
    message: 'Missing plugin.',
    details: `The plugin configuration is missing plugin '${plugin}' and is required for '${tool}'.

The required plugins for are: ['${REQUIRED_PLUGINS.join("','")}'].`,
  }),
  EPUBLISHCONFIGMISMATCH: ({ repositoryEndpoint, publishConfig }) => ({
    message: 'Mismatch on CodeArtifact repository and publishConfig.',
    details: `The registry set in the \`publishConfig\` of your package.json does not match the CodeArtifact endpoint.

The package.json \`publishConfig\` registry is '${publishConfig.registry}.'
The CodeArtifact endpoint is '${repositoryEndpoint}'.`,
  }),
  ENOAUTHTOKEN: () => ({
    message: 'No auth token returned from CodeArtifact client',
    details: `The CodeArtifact client returned and empty value for \`authToken\`.

Please check your AWS configuration and try again.`,
  }),
  ENOREPOENDPOINT: () => ({
    message: 'No endpoint returned from CodeArtifact client',
    details: `The CodeArtifact client returned and empty value for \`repositoryEndpoint\`.

Please check your AWS configuration and try again.`,
  }),
};
