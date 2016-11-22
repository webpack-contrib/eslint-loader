var test = require("tape")
var webpack = require("webpack")
var assign = require("object-assign")
var conf = require("./utils/conf")

test("eslint-loader will create an engine for each unique config", function(t) { // eslint-disable-line max-len
  webpack(assign({},
    conf,
    {
      entry: "./test/fixtures/good.js",
      module: {
        loaders: [
          {
            test: /\.js$/,
            loader: "./index",
            query: {
              rules: {
                quotes: [1, "single"],
              },
            },
            exclude: /node_modules/,
          },
          {
            test: /\.js$/,
            loader: "./index",
            query: {
              rules: {
                semi: [1, "always"],
              },
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
      "should report an error for each config"
    )

    t.ok(
      stats.compilation.warnings.find(warning => /quotes/.test(warning)),
      "should have a warning about quotes"
    )

    t.ok(
      stats.compilation.warnings.find(warning => /semi/.test(warning)),
      "should have a warning about semi"
    )

    t.end()
  })
})
