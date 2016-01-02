var test = require("tape")
var webpack = require("webpack")
var assign = require("object-assign")
var conf = require("./utils/conf")
var fs = require("fs")

// clone the "fixable" file, so that we do not lose the original contents
// when the fixes are applied to disk
test("setup", function(t) {
  fs
    .createReadStream("./test/fixtures/fixable.js")
    .pipe(fs.createWriteStream("./test/fixtures/fixable-clone.js"))

  t.end()
})

test("loader doesn't throw error if file ok after auto-fixing", function(t) {
  webpack(assign({},
    conf,
    {
      entry: "./test/fixtures/fixable-clone.js",
      module: {
        loaders: [
          {
            test: /\.js$/,
            loader: "./index?fix=true",
            exclude: /node_modules/,
          },
        ],
      },
    }
  ),
  function(err, stats) {
    if (err) {
      throw err
    }
    // console.log(stats.compilation.errors)
    t.notOk(stats.hasErrors(), "a good file doesn't give any error")
    // console.log(stats.compilation.warnings)
    t.notOk(stats.hasWarnings(), "a good file doesn't give any warning")
    t.end()
  })
})

// remove the clone
test("teardown", function(t) {
  fs.unlinkSync("./test/fixtures/fixable-clone.js")
  t.end()
})
