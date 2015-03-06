"use strict";

var test = require("tape")

var webpack = require("webpack")
var assign = require("object-assign")

var conf = {
  output: {
    path: "./test/output/",
    filename: "bundle.js"
  },
  module: {
    loaders: [
      {test: /\.js$/, loader: "./index", exclude: /node_modules/}
    ]
  }
}

test("eslint-loader don't throw error if file is ok", function(t) {
  webpack(assign({
    entry: "./test/fixtures/good.js"
  }, conf),
  function(err, stats) {
    if (err) {
      throw err
    }

    t.notOk(stats.hasErrors(), "a good file doesn't give any error")
    t.notOk(stats.hasWarnings(), "a good file doesn't give any warning")
    t.end()
  })
})

test("eslint-loader can return warning if file is bad", function(t) {
  webpack(assign({
    entry: "./test/fixtures/bad.js"
  }, conf),
  function(err, stats) {
    if (err) {
      throw err
    }

    t.ok(stats.hasWarnings(), "a bad file should returns warning")
    t.notOk(stats.hasErrors(), "a bad file should returns no error if not asked for")
    t.end()
  })
})


test("eslint-loader can return error if file is bad", function(t) {
  webpack(assign({
    entry: "./test/fixtures/bad.js",
    eslint: {
      emitErrors: true,
      rules: {
        "no-unused-vars": 1
      }
    }
  }, conf),
  function(err, stats) {
    if (err) {
      throw err
    }

    t.ok(stats.hasErrors(), "a bad file should return error if asked")
    t.notOk(stats.hasWarnings(), "a bad file should return no warning if error asked")

    console.log("### Here is a example of the default reporter")
    console.log("# " + stats.compilation.errors[0].message.split("\n").join("\n# "))
    t.end()
  })
})

test("eslint-loader only returns errors and not warnings if quiet is set", function(t) {
  webpack(assign({
    entry: "./test/fixtures/bad.js",
    eslint: {
      quiet: true,
      rules: {
        "no-unused-vars": 1
      }
    }
  }, conf),
  function(err, stats) {
    if (err) {
      throw err;
    }

    t.equal(Number(stats.compilation.warnings[0].message.match(/(\d+) warnings?/)[1]), 0, "the rules set as warnings should be ignored");

    console.log("### Here is an example of the output when quiet is set to true");
    console.log("# " + stats.compilation.warnings[0].message.split("\n").join("\n# "));
    t.end();
  })
})
