var test = require("ava");
var webpack = require("webpack");

var conf = require("./utils/conf");

test.cb(
  "eslint-loader only returns errors and not warnings if quiet is set",
  function(t) {
    t.plan(2);
    webpack(
      conf(
        {
          entry: "./test/fixtures/warn.js"
        },
        {
          quiet: true
        }
      ),
      function(err, stats) {
        if (err) {
          throw err;
        }

        // console.log(stats.compilation.warnings)
        t.false(
          stats.hasWarnings(),
          "a file that contains eslint warning should return nothing if quiet " +
            "option is true"
        );
        // console.log(stats.compilation.errors)
        t.false(
          stats.hasErrors(),
          "a file that contains eslint warning should return no error if it " +
            "contains only warning in quiet mode"
        );
        t.end();
      }
    );
  }
);
