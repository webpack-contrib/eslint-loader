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
                quotes: [1, "double"],
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
      stats.compilation.warnings.length === 1,
      "should report a single error because only one config causes an error"
    )

    t.end()
  })
})
