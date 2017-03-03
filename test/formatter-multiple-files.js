var test = require("ava")
var webpack = require("webpack")
var conf = require("./utils/conf")
var fs = require("fs")

test.cb("eslint-loader can be configured to write multiple eslint result files",
function(t) {
  var outputFilename = "outputReport-[name].txt"
  var outputFilenamesArr = [
    "outputReport-error-multi-two.txt",
    "outputReport-error-multi-one.txt",
    "outputReport-error-multi.txt",
  ]
  var config = conf(
    {
      entry: [
        "./test/fixtures/error-multi.js",
      ],
    },
    {
      formatter: require("eslint/lib/formatters/checkstyle"),
      outputReport: {
        filePath: outputFilename,
      },
    }
  )

  /* Plan for the success count. Failure cases are going to fail anyway so the
   * count being off for those cases doesn't matter. */
  t.plan(outputFilenamesArr.length * 2)

  webpack(config,
  function(err, stats) {
    if (err) {
      throw err
    }

    for (var i = 0; i < outputFilenamesArr.length; i++) {
      var filename = config.output.path + outputFilenamesArr[i]

      try {
        var contents = fs.readFileSync(filename, "utf8")
        var statsend = stats.compilation.errors.length - 1

        t.pass("File '" + filename + "' has been created")

        /* With require() loading the compilation messages seem to push in
         * reverse. */
        t.is(stats.compilation.errors[statsend - i].message, contents,
          "File '" + filename + "' Contents should equal output")
      }
      catch (e) {
        t.fail("Expected file '" + filename + "' to have been created:" + e)
      }
    }

    t.end()
  })
})
