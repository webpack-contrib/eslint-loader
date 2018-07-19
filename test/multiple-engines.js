var test = require("ava");
var webpack = require("webpack");

var conf = require("./utils/conf");

test.cb("eslint-loader will create an engine for each unique config", function(
  t
) {
  // eslint-disable-line max-len
  t.plan(3);
  webpack(
    conf({
      entry: "./test/fixtures/good.js",
      module: {
        rules: [
          {
            test: /\.js$/,
            use: "./index?{rules:{quotes:[1,'single']}}",
            exclude: /node_modules/
          },
          {
            test: /\.js$/,
            use: "./index?{rules:{semi:[1,'always']}}",
            exclude: /node_modules/
          }
        ]
      }
    }),
    function(err, stats) {
      if (err) {
        throw err;
      }

      t.true(
        stats.compilation.warnings.length === 2,
        "should report an error for each config"
      );

      t.truthy(
        stats.compilation.warnings.find(warning => /quotes/.test(warning)),
        "should have a warning about quotes"
      );

      t.truthy(
        stats.compilation.warnings.find(warning => /semi/.test(warning)),
        "should have a warning about semi"
      );

      t.end();
    }
  );
});
