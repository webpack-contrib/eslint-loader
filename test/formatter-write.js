/* eslint-disable no-console */
var test = require("ava")
var webpack = require("webpack")
var conf = require("./utils/conf")
var webpackWeirdPrefix = require("./utils/weird-prefix.js")
var fs = require("fs")

test.cb("eslint-loader can be configured to write eslint results to a file",
function(t) {
  t.plan(2)

  var outputFilename = "outputReport.txt"
  var config = conf(
    {
      entry: "./test/fixtures/error.js",
    },
    {
      formatter: require("eslint/lib/formatters/checkstyle"),
      outputReport: {
        filePath: outputFilename,
      },
    }
  )

  webpack(config,
  function(err, stats) {
    if (err) {
      throw err
    }

    console.log("### Here is a the output of the formatter")
    console.log(
      "# " +
      stats.compilation.errors[0].message
        .split("\n")
        .join("\n# ")
    )

    fs.readFile(config.output.path + outputFilename,
      "utf8", function(err, contents) {
        if (err) {
          t.fail("Expected file to have been created")
        }
        else {
          t.pass("File has been created")

          t.is(
            stats.compilation.errors[0].message,
            webpackWeirdPrefix + contents,
            "File Contents should equal output"
          )
        }

        t.end()

      })
  })
})
