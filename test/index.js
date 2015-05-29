var test = require("tape")

var webpack = require("webpack")
var assign = require("object-assign")

var conf = {
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
  // this disables the use of .eslintignore, since it contains the fixture
  // folder to skip for the global linting, but here we want the opposite
  // (we only use .eslintignore to the test that checks this)
  eslint: {
    ignore: false,
  },
}

test("eslint-loader don't throw error if file is ok", function(t) {
  webpack(assign({},
    conf,
    {
      entry: "./test/fixtures/good.js",
    }
  ),
  function(err, stats) {
    if (err) {throw err}

    t.notOk(stats.hasErrors(), "a good file doesn't give any error")
    t.notOk(stats.hasWarnings(), "a good file doesn't give any warning")
    t.end()
  })
})

test("eslreporterint-loader can return warning", function(t) {
  webpack(assign({},
    conf,
    {
      entry: "./test/fixtures/warn.js",
    }
  ),
  function(err, stats) {
    if (err) {throw err}

    t.ok(stats.hasWarnings(), "a file that contains eslint warning should return warning")
    t.notOk(stats.hasErrors(), "a bad file should return no error if it contains only warning by default")
    t.end()
  })
})

test("eslint-loader only returns errors and not warnings if quiet is set", function(t) {
  webpack(assign({},
    conf,
    {
      entry: "./test/fixtures/warn.js",
      eslint: assign({}, conf.eslint, {
        quiet: true,
      }),
    }
  ),
  function(err, stats) {
    if (err) {throw err}

    t.notOk(stats.hasWarnings(), "a file that contains eslint warning should return nothing if quiet option is true")
    t.notOk(stats.hasErrors(), "a file that contains eslint warning should return no error if it contains only warning in quiet mode")
    t.end()
  })
})

test("eslint-loader can return error if file is bad", function(t) {
  webpack(assign({},
    conf,
    {
      entry: "./test/fixtures/error.js",
    }
  ),
  function(err, stats) {
    if (err) {throw err}

    t.ok(stats.hasErrors(), "a file that contains eslint errors should return error")
    t.end()
  })
})

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

test("eslint-loader can use eslint formatter", function(t) {
  webpack(assign({},
    conf,
    {
      entry: "./test/fixtures/error.js",
    }
  ),
  function(err, stats) {
    if (err) {throw err}

    console.log("### Here is a example of the default formatter")
    console.log("# " + stats.compilation.errors[0].message.split("\n").join("\n# "))
    t.ok(stats.compilation.errors[0].message, "webpack have some output")
    t.end()
  })
})

test("eslint-loader can use custom formatter", function(t) {
  webpack(assign({},
    conf,
    {
      entry: "./test/fixtures/error.js",
      eslint: assign(conf.eslint, {
        formatter: require("eslint-friendly-formatter"),
      }),
    }
  ),
  function(err, stats) {
    if (err) {throw err}

    console.log("### Here is a example of another formatter")
    console.log("# " + stats.compilation.errors[0].message.split("\n").join("\n# "))
    t.ok(stats.compilation.errors[0].message, "webpack have some output with custom formatters")
    t.end()
  })
})

test("eslint-loader supports query strings parameters", function(t) {
  webpack(assign({},
    conf,
    {
      entry: "./test/fixtures/good-semi.js",
      module: {
        loaders: [
          {
            test: /\.js$/,
            loader: "./index?{rules:[{semi:0}]}",
            exclude: /node_modules/,
          },
        ],
      },
    }
  ),
  function(err, stats) {
    if (err) {throw err}

    t.notOk(stats.hasErrors(), "a good file doesn't give any error")
    t.notOk(stats.hasWarnings(), "a good file doesn't give any warning")
    t.end()
  })
})

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

    t.ok(stats.hasWarnings(), "an ignored file gives a warning")
    t.end()
  })
})
