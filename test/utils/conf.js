module.exports = {
  output: {
    path: "./test/output/",
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
  // this disables the use of .eslintignore, since it contains the fixtures
  // folder to skip it on the global linting, but here we want the opposite
  // (we only use .eslintignore on the test that checks this)
  eslint: {
    ignore: false,
  },
}
