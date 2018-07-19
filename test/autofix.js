var fs = require("fs");

var test = require("ava");
var webpack = require("webpack");

var conf = require("./utils/conf");

// clone the "fixable" file, so that we do not lose the original contents
// when the fixes are applied to disk
test.before(function() {
  fs.createReadStream("./test/fixtures/fixable.js").pipe(
    fs.createWriteStream("./test/fixtures/fixable-clone.js")
  );
});

test.cb("loader doesn't throw error if file ok after auto-fixing", function(t) {
  t.plan(2);
  webpack(
    conf({
      entry: "./test/fixtures/fixable-clone.js",
      module: {
        rules: [
          {
            test: /\.js$/,
            use: "./index?fix=true",
            exclude: /node_modules/
          }
        ]
      }
    }),
    function(err, stats) {
      if (err) {
        throw err;
      }
      // console.log(stats.compilation.errors)
      t.false(stats.hasErrors(), "a good file doesn't give any error");
      // console.log(stats.compilation.warnings)
      t.false(stats.hasWarnings(), "a good file doesn't give any warning");
      t.end();
    }
  );
});

// remove the clone
test.after.always(function() {
  fs.unlinkSync("./test/fixtures/fixable-clone.js");
});
