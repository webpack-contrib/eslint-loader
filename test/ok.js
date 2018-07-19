var test = require("ava");
var webpack = require("webpack");

var conf = require("./utils/conf");

test.cb("eslint-loader don't throw error if file is ok", function(t) {
  t.plan(2);
  webpack(
    conf({
      entry: "./test/fixtures/good.js"
    }),
    function(err, stats) {
      if (err) {
        throw err;
      }

      // console.log(stats.compilation.errors)
      t.false(stats.hasErrors(), "a good file doesn't give any error");
      // console.log(stats.compilation.warnings)
      t.false(stats.hasWarnings(), "a good file doesn't give any warning");
      t.end();
    }
  );
});
