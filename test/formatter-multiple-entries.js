var fs = require("fs");
var path = require("path");

var test = require("ava");
var webpack = require("webpack");
var CLIEngine = require("eslint").CLIEngine;

var conf = require("./utils/conf");

test.cb(
  "eslint-loader can be configured to write multiple eslint result files",
  function(t) {
    var outputFilename = "outputReport-[name].txt";

    var config = conf(
      {
        entry: [
          "./test/fixtures/error-multi-two.js",
          "./test/fixtures/error-multi-one.js",
          "./test/fixtures/error-multi.js"
        ]
      },
      {
        formatter: CLIEngine.getFormatter("checkstyle"),
        outputReport: {
          filePath: outputFilename
        }
      }
    );

    /* Plan for the success count. Failure cases are going to fail anyway so the
     * count being off for those cases doesn't matter. */
    t.plan(config.entry.length * 2);

    webpack(config, function(err, stats) {
      if (err) {
        throw err;
      }

      stats.compilation.errors.forEach(function(error) {
        var basename = path.basename(error.module.resource, ".js");
        var filename = config.output.path + "outputReport-" + basename + ".txt";

        try {
          var contents = fs.readFileSync(filename, "utf8");

          t.pass("File '" + filename + "' has been created");
          t.is(
            error.error.message,
            contents,
            "File '" + filename + "' Contents should equal output"
          );
        } catch (e) {
          t.fail("Expected file '" + filename + "' to have been created:" + e);
        }
      });

      t.end();
    });
  }
);
