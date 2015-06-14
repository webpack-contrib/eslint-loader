var test = require("tape")
var webpack = require("webpack")
var assign = require("object-assign")
var conf = require("./utils/conf")

test("eslint-loader can force to emit error", function(t) {
  webpack(assign({},
    conf,
    {
      entry: "./test/fixtures/warn.js",
      eslint: assign({}, conf.eslint, {
        emitError: true,
      }),
    }
  ),
  function(err, stats) {
    if (err) {throw err}

    t.ok(stats.hasErrors(), "a file should return error if asked")
    t.notOk(stats.hasWarnings(), "a file should return no warning if error asked")
    t.end()
  })
})

test("eslint-loader can force to emit warning", function(t) {
  webpack(assign({},
    conf,
    {
      entry: "./test/fixtures/error.js",
      eslint: assign({}, conf.eslint, {
        emitWarning: true,
      }),
    }
  ),
  function(err, stats) {
    if (err) {throw err}

    t.ok(stats.hasWarnings(), "a file should return warning if asked")
    t.notOk(stats.hasErrors(), "a file should return no error if error asked")
    t.end()
  })
})
