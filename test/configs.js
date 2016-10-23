var test = require("tape")
var webpack = require("webpack")
var assign = require("object-assign")
var conf = require("./utils/conf")

test("eslint-loader should respect custom configFile paths", function(t) {
  webpack(assign({},
    conf,
    {
      eslint: {
        ignore: false,
      },
      entry: [
        "./test/fixtures/good.js",
      ],
      module: {
        loaders: [
          {
            test: /\.js$/,
            loader: "./index",
            query: {
              configFile: './test/utils/eslint-config-quotes-single',
            },
            exclude: /node_modules/,
          },
        ],
      },
    }
  ),
  function(err, stats) {
    if (err) {
      throw err
    }

    t.ok(
      stats.compilation.warnings.length === 1,
      "one warning for double quotes"
    )

    t.notOk(
      stats.compilation.warnings.length !== 1,
      "the config file was loaded and double quotes threw a warning"
    )
    t.end()
  })
})

test("eslint-loader should handle multiple configFile paths", function(t) {
  webpack(assign({},
    conf,
    {
      eslint: {
        ignore: false,
      },
      entry: [
        "./test/fixtures/good.js",
      ],
      module: {
        loaders: [
          {
            test: /\.js$/,
            loader: "./index",
            query: {
              configFile: './test/utils/eslint-config-quotes-single',
            },
            exclude: /node_modules/,
          },
          {
            test: /\.js$/,
            loader: "./index",
            query: {
              configFile: './test/utils/eslint-config-semi',
            },
            exclude: /node_modules/,
          },
        ],
      },
    }
  ),
  function(err, stats) {
    if (err) {
      throw err
    }

    t.ok(
      stats.compilation.warnings.length === 2,
      "one warning from each config file"
    )

    t.notOk(
      stats.compilation.warnings.length !== 2,
      "all config files was loaded and each threw their warnings"
    )
    t.end()
  })
})
