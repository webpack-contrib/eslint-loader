var test = require("tape")
var webpack = require("webpack")
var assign = require("object-assign")
var conf = require("./utils/conf")

test("eslint-loader can return warning", function(t) {
  webpack(assign({},
    conf,
    {
      entry: "./test/fixtures/warn.js",
    }
  ),
  function(err, stats) {
    if (err) {throw err}

    // console.log(stats.compilation.warnings)
    t.ok(stats.hasWarnings(), "a file that contains eslint warning should return warning")

    // console.log(stats.compilation.errors)
    t.notOk(stats.hasErrors(), "a bad file should return no error if it contains only warning by default")
    t.end()
  })
})
