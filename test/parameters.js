var test = require("tape")
var webpack = require("webpack")
var assign = require("object-assign")
var conf = require("./utils/conf")

test("eslint-loader supports query strings parameters", function(t) {
  webpack(assign({},
    conf,
    {
      entry: "./test/fixtures/good-semi.js",
      module: {
        loaders: [
          {
            test: /\.js$/,
            loader: "./index?{rules:[{semi:0}]}",
            exclude: /node_modules/,
          },
        ],
      },
    }
  ),
  function(err, stats) {
    if (err) {throw err}

    t.notOk(stats.hasErrors(), "a good file doesn't give any error")
    t.notOk(stats.hasWarnings(), "a good file doesn't give any warning")
    t.end()
  })
})
