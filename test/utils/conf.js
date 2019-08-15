const path = require('path');

const webpack = require('webpack');

const webpackVersion = require('./version');

const DEFAULT_CONFIG = {
  output: {
    path: path.join(__dirname, '..', 'output') + path.sep,
    filename: 'bundle.js',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: './src/index',
        exclude: /node_modules/,
      },
    ],
  },
};

/**
 * Returns a valid config for both webpack versions 1 and 2.
 * @param webpackConf Additional webpack config to apply/override to the default
 * @param loaderConf Additional eslint config to apply/override to the default
 * @returns {Object}
 */
module.exports = function conf(webpackConf, loaderConf) {
  const mode = webpackVersion < 4 ? {} : { mode: 'development' };

  const options = {
    eslint: {
      // this disables the use of .eslintignore, since it contains the fixtures
      // folder to skip it on the global linting, but here we want the opposite
      // (we only use .eslintignore on the test that checks this)
      ignore: false,
      ...loaderConf,
    },
  };

  // webpack v2 requires them to be added via the LoaderOptionsPlugin
  // webpack v4 needs mode option
  return {
    ...DEFAULT_CONFIG,
    ...mode,
    ...webpackConf,
    plugins: [
      new webpack.LoaderOptionsPlugin({
        exclude: /node_modules/,
        options,
      }),
    ],
  };
};
