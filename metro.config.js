const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const config = getDefaultConfig(__dirname);

// Enable CSS support
config.transformer.babelTransformerPath = require.resolve('react-native-css-transformer');

// Add support for CSS/SCSS files
config.resolver.sourceExts.push('css', 'scss');

// Configure path aliases
config.resolver.alias = {
  '@': path.resolve(__dirname, '.'),
};

module.exports = config;