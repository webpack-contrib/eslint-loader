var test = require("ava");
var webpack = require("webpack");

var conf = require("./utils/conf");

test.cb("eslint-loader ignores files present in .eslintignore", function(t) {
  t.plan(1);
  webpack(
    conf(
      {
        entry: "./test/fixtures/ignore.js"
      },
      {
        // we want to enable ignore, so eslint will parse .eslintignore and
        // should skip the file specified above
        ignore: true
      }
    ),
    function(err, stats) {
      if (err) {
        throw err;
      }

      // console.log(stats.compilation.warnings)
      t.false(stats.hasWarnings(), "an ignored doesn't give a warning");
      t.end();
    }
  );
});
