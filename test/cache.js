var test = require("ava")
var webpack = require("webpack")
var conf = require("./utils/conf")
var fs = require("fs")

var cacheFilePath = "./node_modules/.cache/eslint-loader/data.json"

test.cb("eslint-loader can cache results", function(t) {
  t.plan(2)
  webpack(conf(
    {
      entry: "./test/fixtures/cache.js",
    },
    {
      cache: true,
    }
  ),
  function(err) {
    if (err) {
      throw err
    }

    fs.readFile(cacheFilePath, "utf8", function(err, contents) {
      if (err) {
        t.fail("expected cache file to have been created")
      }
      else {
        t.pass("cache file has been created")

        var contentsJson = JSON.parse(contents)
        t.deepEqual(
          Object.keys(contentsJson["test/fixtures/cache.js"]),
          ["hash", "rules", "res"],
          "cache values have been set for the linted file"
        )
      }

      t.end()

    })

  })
})

// delete the cache file once tests have completed
test.after.always("teardown", function() {
  fs.unlinkSync(cacheFilePath)
})