export const getRegistryFromNpmrc = (npmrc = ''): string[] => {
  return npmrc
    .split('\n')
    .filter(config => config.includes('registry='))
    .map(registry => {
      const [, url] = registry.split('registry=');
      return url;
    });
};

export const replaceEnvVarsInNpmrc = (npmrc = ''): string => {
  const re = /(\$\{)([^}]+)(})/g;
  const matches = npmrc.matchAll(re);
  for (const match of matches) {
    npmrc = npmrc.replace(match[0], process.env[match[2]] || '');
  }

  return npmrc;
};
