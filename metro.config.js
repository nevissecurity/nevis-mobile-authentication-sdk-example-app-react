const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');

// Path to local nevis-mobile-authentication-sdk-react package
//const nevisMobileAuthenticationSdkPackagePath = '../nevis-mobile-authentication-sdk-react';

/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
 * @type {import('@react-native/metro-config').MetroConfig}
 */
const config = {
	/*resolver: {
        nodeModulesPaths: [nevisMobileAuthenticationSdkPackagePath],
    },
    watchFolders: [nevisMobileAuthenticationSdkPackagePath],*/
};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);
