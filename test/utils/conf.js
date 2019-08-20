import { join, sep } from 'path';

/**
 * Returns a valid config for webpack.
 * @param webpackConf Additional webpack config to apply/override to the default
 * @param loaderConf Additional eslint config to apply/override to the default
 * @returns {Object}
 */
module.exports = function conf(webpackConf, loaderConf) {
  return {
    mode: 'development',
    output: {
      path: join(__dirname, '..', 'output') + sep,
      filename: 'bundle.js',
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: [
            {
              loader: './src/index',
              options: {
                // this disables the use of .eslintignore, since it contains the fixtures
                // folder to skip it on the global linting, but here we want the opposite
                // (we only use .eslintignore on the test that checks this)
                ignore: false,
                ...loaderConf,
              },
            },
          ],
        },
      ],
    },
    ...webpackConf,
  };
};
