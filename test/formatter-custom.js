/* eslint-disable no-console */
var test = require("ava");
var webpack = require("webpack");

var conf = require("./utils/conf");

test.cb("eslint-loader can use custom formatter", function(t) {
  t.plan(1);
  webpack(
    conf(
      {
        entry: "./test/fixtures/error.js"
      },
      {
        formatter: require("eslint-friendly-formatter")
      }
    ),
    function(err, stats) {
      if (err) {
        throw err;
      }

      // console.log("### Here is a example of another formatter")
      // console.log(
      //   "# " +
      //   stats.compilation.errors[0].message
      //     .split("\n")
      //     .join("\n# ")
      // )
      t.truthy(
        stats.compilation.errors[0].message,
        "webpack have some output with custom formatters"
      );
      t.end();
    }
  );
});
