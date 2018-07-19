var test = require("ava");
var webpack = require("webpack");

var conf = require("./utils/conf");

test.cb("eslint-loader can force to emit error", function(t) {
  t.plan(2);
  webpack(
    conf(
      {
        entry: "./test/fixtures/warn.js"
      },
      {
        emitError: true
      }
    ),
    function(err, stats) {
      if (err) {
        throw err;
      }

      // console.log(stats.compilation.errors)
      t.true(stats.hasErrors(), "a file should return error if asked");
      // console.log(stats.compilation.warnings)
      t.false(
        stats.hasWarnings(),
        "a file should return no warning if error asked"
      );
      t.end();
    }
  );
});
