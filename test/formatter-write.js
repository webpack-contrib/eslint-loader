/* eslint-disable no-console */
var fs = require("fs");
var path = require("path");

var test = require("ava");
var webpack = require("webpack");

var conf = require("./utils/conf");

test.cb(
  "eslint-loader can be configured to write eslint results to a file (relative path)",
  function(t) {
    t.plan(2);

    var outputFilename = "outputReport.txt";
    var config = conf(
      {
        entry: "./test/fixtures/error.js"
      },
      {
        formatter: require("eslint/lib/formatters/checkstyle"),
        outputReport: {
          filePath: outputFilename
        }
      }
    );

    webpack(config, function(err, stats) {
      if (err) {
        throw err;
      }

      // console.log("### Here is a the output of the formatter")
      // console.log(
      //   "# " +
      //   stats.compilation.errors[0].error.message
      //     .split("\n")
      //     .join("\n# ")
      // )

      fs.readFile(config.output.path + outputFilename, "utf8", function(
        err,
        contents
      ) {
        if (err) {
          t.fail("Expected file to have been created");
        } else {
          t.pass("File has been created");

          t.is(
            stats.compilation.errors[0].error.message,
            contents,
            "File Contents should equal output"
          );
        }

        t.end();
      });
    });
  }
);

test.cb(
  "eslint-loader can be configured to write eslint results to a file (absolute path)",
  function(t) {
    t.plan(2);

    var outputFilename = "outputReport-absolute.txt";
    var outputFilepath = path.join(__dirname, "output", outputFilename);
    var config = conf(
      {
        entry: "./test/fixtures/error.js"
      },
      {
        formatter: require("eslint/lib/formatters/checkstyle"),
        outputReport: {
          filePath: outputFilepath
        }
      }
    );

    webpack(config, function(err, stats) {
      if (err) {
        throw err;
      }

      // console.log("### Here is a the output of the formatter")
      // console.log(
      //   "# " +
      //   stats.compilation.errors[0].error.message
      //     .split("\n")
      //     .join("\n# ")
      // )

      fs.readFile(outputFilepath, "utf8", function(err, contents) {
        if (err) {
          t.fail("Expected file to have been created");
        } else {
          t.pass("File has been created");

          t.is(
            stats.compilation.errors[0].error.message,
            contents,
            "File Contents should equal output"
          );
        }

        t.end();
      });
    });
  }
);
