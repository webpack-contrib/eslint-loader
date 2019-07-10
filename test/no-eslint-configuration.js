var test = require("ava");
var webpack = require("webpack");

var conf = require("./utils/conf");

test.cb(
  "eslint-loader emit warning when there is no eslint configuration",
  function(t) {
    t.plan(2);
    webpack(
      conf(
        {
          entry: "./test/fixtures/good.js"
        },
        {
          cwd: "/"
        }
      ),
      function(err, stats) {
        if (err) {
          throw err;
        }

        t.true(stats.hasWarnings());
        t.regex(
          "No ESLint configuration found in /home/ricardo/code/test/fixtures.",
          /^no eslint configuration/i
        );
        t.end();
      }
    );
  }
);
