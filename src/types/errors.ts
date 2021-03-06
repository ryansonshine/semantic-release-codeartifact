import { PluginConfig } from './context';

export interface ErrorDetails {
  message: string;
  details: string;
}

export interface ErrorDefinitions {
  EINVALIDTOOL: (pluginConfig: Partial<PluginConfig>) => ErrorDetails;
  ENODOMAINSET: (...args: unknown[]) => ErrorDetails;
  ENOREPOSET: () => ErrorDetails;
  ENOAWSREGION: () => ErrorDetails;
  ENOAWSACCESSKEY: () => ErrorDetails;
  ENOAWSSECRETKEY: () => ErrorDetails;
  EMISSINGPLUGIN: (pluginConfig: Partial<PluginConfig>) => ErrorDetails;
  EPUBLISHCONFIGMISMATCH: (pluginConfig: Partial<PluginConfig>) => ErrorDetails;
  ENPMRCCONFIGMISMATCH: (pluginConfig: Partial<PluginConfig>) => ErrorDetails;
  ENPMRCMULTIPLEREGISTRY: (pluginConfig: Partial<PluginConfig>) => ErrorDetails;
  ENOAUTHTOKEN: () => ErrorDetails;
  ENOREPOENDPOINT: () => ErrorDetails;
  EAWSSDK: (pluginConfig: Partial<PluginConfig>) => ErrorDetails;
}

export type AWSError = Error & {
  $metadata: Record<string, unknown>;
  code: string;
  errno: string;
  hostname: string;
  syscall: string;
};
