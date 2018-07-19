var test = require("ava");
var webpack = require("webpack");

var conf = require("./utils/conf");

test.cb("emits errors in async mode", function(t) {
  t.plan(1);
  webpack(
    conf(
      {
        cache: true,
        entry: "./test/fixtures/error.js"
      },
      {
        failOnError: true,
        emitError: true,
        cache: true
      }
    ),
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

test.cb("correctly indentifies a success", function(t) {
  t.plan(1);
  webpack(
    conf(
      {
        cache: true,
        entry: "./test/fixtures/good.js"
      },
      {
        failOnError: true,
        emitError: true,
        cache: true
      }
    ),
    function(err, stats) {
      if (err) {
        throw err;
      }

      // console.log(stats.compilation.errors)
      t.false(
        stats.hasErrors(),
        "a file that doesn't contains eslint errors should not return errors"
      );
      t.end();
    }
  );
});
