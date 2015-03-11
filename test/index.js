"use strict";

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
}

test("eslint-loader don't throw error if file is ok", function(t) {
  webpack(assign({
    entry: "./test/fixtures/good.js",
  }, conf),
  function(err, stats) {
    if (err) {throw err}

    t.notOk(stats.hasErrors(), "a good file doesn't give any error")
    t.notOk(stats.hasWarnings(), "a good file doesn't give any warning")
    t.end()
  })
})

test("eslint-loader can return warning", function(t) {
  webpack(assign({
    entry: "./test/fixtures/warn.js",
  }, conf),
  function(err, stats) {
    if (err) {throw err}

    t.ok(stats.hasWarnings(), "a file that contains eslint warning should return warning")
    t.notOk(stats.hasErrors(), "a bad file should return no error if it contains only warning by default")
    t.end()
  })
})

test("eslint-loader only returns errors and not warnings if quiet is set", function(t) {
  webpack(assign({
    entry: "./test/fixtures/warn.js",
    eslint: {
      quiet: true,
    },
  }, conf),
  function(err, stats) {
    if (err) {throw err}

    t.notOk(stats.hasWarnings(), "a file that contains eslint warning should return nothing if quiet option is true")
    t.notOk(stats.hasErrors(), "a file that contains eslint warning should return no error if it contains only warning in quiet mode")
    t.end()
  })
})

test("eslint-loader can return error if file is bad", function(t) {
  webpack(assign({
    entry: "./test/fixtures/error.js",
  }, conf),
  function(err, stats) {
    if (err) {throw err}

    t.ok(stats.hasErrors(), "a file that contains eslint errors should return error")
    t.end()
  })
})

test("eslint-loader can force to emit error", function(t) {
  webpack(assign({
    entry: "./test/fixtures/warn.js",
    eslint: {
      emitError: true,
    },
  }, conf),
  function(err, stats) {
    if (err) {throw err}

    t.ok(stats.hasErrors(), "a file should return error if asked")
    t.notOk(stats.hasWarnings(), "a file should return no warning if error asked")
    t.end()
  })
})

test("eslint-loader can force to emit warning", function(t) {
  webpack(assign({
    entry: "./test/fixtures/error.js",
    eslint: {
      emitWarning: true,
    },
  }, conf),
  function(err, stats) {
    if (err) {throw err}

    t.ok(stats.hasWarnings(), "a file should return warning if asked")
    t.notOk(stats.hasErrors(), "a file should return no error if error asked")
    t.end()
  })
})

test("eslint-loader can use eslint reporter", function(t) {
  webpack(assign({
    entry: "./test/fixtures/error.js",
  }, conf),
  function(err, stats) {
    if (err) {throw err}

    console.log("### Here is a example of the default reporter")
    console.log("# " + stats.compilation.errors[0].message.split("\n").join("\n# "))
    t.ok(stats.compilation.errors[0].message, "webpack have some output")
    t.end()
  })
})

test("eslint-loader can use custom reporter", function(t) {
  webpack(assign({
    entry: "./test/fixtures/error.js",
    eslint: {
      reporter: require("eslint-friendly-formatter"),
    },
  }, conf),
  function(err, stats) {
    if (err) {throw err}

    console.log("### Here is a example of another reporter")
    console.log("# " + stats.compilation.errors[0].message.split("\n").join("\n# "))
    t.ok(stats.compilation.errors[0].message, "webpack have some output with custom reporters")
    t.end()
  })
})
