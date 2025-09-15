const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');

const config = {
  resolver: {
    alias: {
      'react/jsx-runtime': 'react/jsx-runtime.js',
    },
    unstable_enablePackageExports: false,
  },
  transformer: {
    unstable_allowRequireContext: false,
  },
};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);