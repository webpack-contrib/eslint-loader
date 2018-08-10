var fs = require("fs");

var test = require("ava");
var webpack = require("webpack");

var conf = require("./utils/conf");

var changed = false;

// clone the "fixable" file, so that we do not lose the original contents
// when the fixes are applied to disk
test.before(function() {
  fs.createReadStream("./test/fixtures/nonfixable.js")
    .pipe(fs.createWriteStream("./test/fixtures/nonfixable-clone.js"))
    .on("close", function() {
      fs.watch("./test/fixtures/nonfixable-clone.js", function() {
        changed = true;
      });
    });
});

test.cb("loader change file if there are no fixable errors/warnings", function(
  t
) {
  t.plan(1);
  webpack(
    conf({
      entry: "./test/fixtures/nonfixable-clone.js",
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
    function(err) {
      if (err) {
        throw err;
      }
      // console.log(stats.compilation.errors)
      t.false(
        changed,
        "should not output to file again (triggering a recompile)"
      );
      t.end();
    }
  );
});

// remove the clone
test.after.always(function() {
  fs.unlinkSync("./test/fixtures/nonfixable-clone.js");
});
