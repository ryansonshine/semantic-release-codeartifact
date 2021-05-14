export const getRegistryFromNpmrc = (npmrc = ''): string[] => {
  return npmrc
    .split('\n')
    .filter(config => config.includes('registry='))
    .map(registry => {
      const [, url] = registry.split('registry=');
      return url;
    });
};
