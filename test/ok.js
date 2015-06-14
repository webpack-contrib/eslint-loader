var test = require("tape")
var webpack = require("webpack")
var assign = require("object-assign")
var conf = require("./utils/conf")

test("eslint-loader don't throw error if file is ok", function(t) {
  webpack(assign({},
    conf,
    {
      entry: "./test/fixtures/good.js",
    }
  ),
  function(err, stats) {
    if (err) {throw err}

    t.notOk(stats.hasErrors(), "a good file doesn't give any error")
    t.notOk(stats.hasWarnings(), "a good file doesn't give any warning")
    t.end()
  })
})
