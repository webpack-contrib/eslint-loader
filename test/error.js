var test = require("ava");
var webpack = require("webpack");

var conf = require("./utils/conf");

test.cb("eslint-loader can return error if file is bad", function(t) {
  t.plan(1);
  webpack(
    conf({
      entry: "./test/fixtures/error.js"
    }),
    function(err, stats) {
      if (err) {
        throw err;
      }

      // console.log(stats.compilation.errors)
      t.true(
        stats.hasErrors(),
        "a file that contains eslint errors should return error"
      );
      t.end();
    }
  );
});
