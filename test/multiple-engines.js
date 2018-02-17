var test = require("ava")
var webpack = require("webpack")
var conf = require("./utils/conf")
var loaders = require("./utils/loaders")
var loader = require("./utils/loader")

test.cb("eslint-loader will create an engine for each unique config", function(t) { // eslint-disable-line max-len
  t.plan(3)
  webpack(conf(
    {
      entry: "./test/fixtures/good.js",
      module: {
        [loaders]: [
          {
            test: /\.js$/,
            [loader]: "./index?{rules:{quotes:[1,'single']}}",
            exclude: /node_modules/,
          },
          {
            test: /\.js$/,
            [loader]: "./index?{rules:{semi:[1,'always']}}",
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

    t.true(
      stats.compilation.warnings.length === 2,
      "should report an error for each config"
    )

    t.truthy(
      stats.compilation.warnings.find(warning => /quotes/.test(warning)),
      "should have a warning about quotes"
    )

    t.truthy(
      stats.compilation.warnings.find(warning => /semi/.test(warning)),
      "should have a warning about semi"
    )

    t.end()
  })
})
