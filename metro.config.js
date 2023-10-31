const {getDefaultConfig, mergeConfig} = require('@react-native/metro-config');

// Path to local nevis-mobile-authentication-sdk-react package
//const nevisMobileAuthenticationSdkPackagePath = '../nevis-mobile-authentication-sdk-react';

/**
 * Metro configuration
 * https://facebook.github.io/metro/docs/configuration
 *
 * @type {import('metro-config').MetroConfig}
 */
const config = {
    /*resolver: {
        nodeModulesPaths: [nevisMobileAuthenticationSdkPackagePath],
    },
    watchFolders: [nevisMobileAuthenticationSdkPackagePath],*/
};


module.exports = mergeConfig(getDefaultConfig(__dirname), config);
