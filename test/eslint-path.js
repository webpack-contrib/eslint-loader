var path = require("path");

var test = require("ava");
var webpack = require("webpack");

var conf = require("./utils/conf");

test.cb(
  "eslint-loader can use another instance of eslint via " + "eslintPath config",
  function(t) {
    t.plan(2);
    webpack(
      conf(
        {
          entry: "./test/fixtures/good.js"
        },
        {
          eslintPath: path.join(__dirname, "mock/eslint")
        }
      ),
      function(err, stats) {
        if (err) {
          throw err;
        }

        // console.log(stats.compilation.errors)
        t.true(
          stats.hasErrors(),
          "a file that does not contains error but mock eslint instance " +
            "returned error"
        );
        t.true(
          (stats.compilation.errors[0].message + "").indexOf("Fake error") > -1
        );
        t.end();
      }
    );
  }
);
