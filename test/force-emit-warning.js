var test = require("ava");
var webpack = require("webpack");

var conf = require("./utils/conf");

test.cb("eslint-loader can force to emit warning", function(t) {
  t.plan(2);
  webpack(
    conf(
      {
        entry: "./test/fixtures/error.js"
      },
      {
        emitWarning: true
      }
    ),
    function(err, stats) {
      if (err) {
        throw err;
      }

      // console.log(stats.compilation.warnings)
      t.true(stats.hasWarnings(), "a file should return warning if asked");
      // console.log(stats.compilation.errors)
      t.false(
        stats.hasErrors(),
        "a file should return no error if error asked"
      );
      t.end();
    }
  );
});
