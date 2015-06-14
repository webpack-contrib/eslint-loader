var test = require("tape")
var webpack = require("webpack")
var assign = require("object-assign")
var conf = require("./utils/conf")

test("eslint-loader ignores files present in .eslintignore", function(t) {
  webpack(assign({},
    conf,
    {
      entry: "./test/fixtures/ignore.js",
      eslint: assign({}, conf.eslint, {
        // we want to enable ignore, so eslint will parse .eslintignore and
        // should skip the file specified above
        ignore: true,
      }),
    }
  ),
  function(err, stats) {
    if (err) {throw err}

    t.notOk(stats.hasWarnings(), "an ignored doesn't give a warning")
    t.end()
  })
})
