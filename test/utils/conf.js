var path = require("path")

var webpack = require("webpack")
var assign = require("object-assign")

var DEFAULT_CONFIG = {
  output: {
    path: path.join(__dirname, "..", "output") + path.sep,
    filename: "bundle.js",
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        loader: "./index",
        exclude: /node_modules/,
      },
    ],
  },
}

/**
 * Returns a valid config for both webpack versions 1 and 2.
 * @param webpackConf Additional webpack config to apply/override to the default
 * @param loaderConf Additional eslint config to apply/override to the default
 * @returns {Object}
 */
module.exports = function conf(webpackConf, loaderConf) {

  loaderConf = {
    eslint: assign({
      // this disables the use of .eslintignore, since it contains the fixtures
      // folder to skip it on the global linting, but here we want the opposite
      // (we only use .eslintignore on the test that checks this)
      ignore: false,
    }, loaderConf),
  }

  // webpack v1 allows loader option to be added directly to the root webpack
  // config object
  // webpack v2 requires them to be added via the LoaderOptionsPlugin
  return assign(DEFAULT_CONFIG, webpackConf,
    process.env.WEBPACK_VERSION === "1" ?
      loaderConf : {
        plugins: [
          new webpack.LoaderOptionsPlugin({
            exclude: /node_modules/,
            options: loaderConf,
          }),
        ],
      }
  )

}
