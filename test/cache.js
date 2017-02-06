var test = require("tape")
var webpack = require("webpack")
var assign = require("object-assign")
var conf = require("./utils/conf")
var fs = require("fs")

var cacheFilePath = "./node_modules/.cache/eslint-loader/data.json"

test("eslint-loader can cache results", function(t) {

  // delete the require cache for eslint-loader otherwise any previously run
  // tests will have initialised the cache as false and prevent this test
  // from creating the cache file
  delete require.cache[require.resolve("../index.js")]

  webpack(assign({},
    conf,
    {
      entry: "./test/fixtures/cache.js",
      eslint: {
        cache: true,
      },
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
test("teardown", function(t) {
  fs.unlinkSync(cacheFilePath)
  t.end()
})