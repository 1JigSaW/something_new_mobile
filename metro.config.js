const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');
const { withNativeWind } = require('nativewind/metro');

/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
 * @type {import('@react-native/metro-config').MetroConfig}
 */
const defaultConfig = getDefaultConfig(__dirname);

module.exports = withNativeWind(
  mergeConfig(defaultConfig, {
    transformer: {
      unstable_allowRequireContext: true,
    },
  }),
  { input: './global.css' }
);
