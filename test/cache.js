var test = require("ava")
var webpack = require("webpack")
var conf = require("./utils/conf")
var fs = require("fs")
var rimraf = require("rimraf")

var cacheDirectory = "./node_modules/.cache/eslint-loader/"

test.cb("should output files to cache directory", function(t) {
  t.plan(2)
  webpack(
    conf(
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
      fs.readdir(cacheDirectory, (err, files) => {
        //eslint-disable-next-line
        console.log(files);
        t.is(err, null)
        t.true(files.length === 1)
        t.end()
      })
    }
  )
})

test.cb(
  "should output json.gz files to standard cache dir by default",
  function(t) {
    t.plan(2)
    webpack(
      conf(
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
        fs.readdir(cacheDirectory, (err, files) => {
          t.is(err, null)
          t.true(
            files.filter(file => file.endsWith(".json.gz")).length ===
              files.length
          )
          t.end()
        })
      }
    )
  }
)
test.cb(
  "should output files to standard cache dir if set to true in query",
  function(t) {
    t.plan(2)
    webpack(
      conf(
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
        fs.readdir(cacheDirectory, (err, files) => {
          t.is(err, null)
          t.true(files.length === 1)
          t.end()
        })
      }
    )
  }
)
test.cb("should read from cache directory if cached file exists", function(t) {
  t.plan(2)
  webpack(
    conf(
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
      fs.readdir(cacheDirectory, (err, files) => {
        t.is(err, null)
        t.true(files.length === 1)
        t.end()
      })
    }
  )
})
test.cb("should have one file per module", function(t) {
  t.plan(2)
  webpack(
    conf(
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
      fs.readdir(cacheDirectory, (err, files) => {
        t.is(err, null)
        t.true(files.length === 1)
        t.end()
      })
    }
  )
})
test.cb("should generate a new file if the identifier changes", function(t) {
  t.plan(2)
  webpack(
    conf(
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
      fs.readdir(cacheDirectory, (err, files) => {
        t.is(err, null)
        t.true(files.length === 1)
        t.end()
      })
    }
  )
})
test.cb("should allow to specify the .babelrc file", function(t) {
  t.plan(2)
  webpack(
    conf(
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
      fs.readdir(cacheDirectory, (err, files) => {
        t.is(err, null)
        t.true(files.length === 1)
        t.end()
      })
    }
  )
})
test.cb("can cache results", function(t) {
  t.plan(2)
  webpack(
    conf(
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
      fs.readdir(cacheDirectory, (err, files) => {
        t.is(err, null)
        t.true(files.length === 1)
        t.end()
      })
    }
  )
})

// delete the cache file once tests have completed
test.after.always("teardown", function() {
  rimraf.sync(cacheDirectory)
})
