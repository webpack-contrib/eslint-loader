import { join, sep } from 'path';

import { LoaderOptionsPlugin } from 'webpack';

const DEFAULT_CONFIG = {
  mode: 'development',
  output: {
    path: join(__dirname, '..', 'output') + sep,
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
 * Returns a valid config for webpack.
 * @param webpackConf Additional webpack config to apply/override to the default
 * @param loaderConf Additional eslint config to apply/override to the default
 * @returns {Object}
 */
module.exports = function conf(webpackConf, loaderConf) {
  return {
    ...DEFAULT_CONFIG,
    ...webpackConf,
    plugins: [
      new LoaderOptionsPlugin({
        exclude: /node_modules/,
        options: {
          eslint: {
            // this disables the use of .eslintignore, since it contains the fixtures
            // folder to skip it on the global linting, but here we want the opposite
            // (we only use .eslintignore on the test that checks this)
            ignore: false,
            ...loaderConf,
          },
        },
      }),
    ],
  };
};
