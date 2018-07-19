var test = require("ava");
var webpack = require("webpack");

var conf = require("./utils/conf");

test.cb("eslint-loader can return warning", function(t) {
  t.plan(2);
  webpack(
    conf({
      entry: "./test/fixtures/warn.js"
    }),
    function(err, stats) {
      if (err) {
        throw err;
      }

      // console.log(stats.compilation.warnings)
      t.true(
        stats.hasWarnings(),
        "a file that contains eslint warning should return warning"
      );

      // console.log(stats.compilation.errors)
      t.false(
        stats.hasErrors(),
        "a bad file should return no error if it contains only warning by default"
      );
      t.end();
    }
  );
});
