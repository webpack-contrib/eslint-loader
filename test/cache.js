var fs = require("fs");
var path = require("path");

var test = require("ava");
var assign = require("object-assign");
var rimraf = require("rimraf");
var mkdirp = require("mkdirp");
var webpack = require("webpack");

var defaultCacheDir = path.join(
  __dirname,
  "../node_modules/.cache/eslint-loader"
);
var cacheDir = path.join(__dirname, "output/cache/cachefiles");
var outputDir = path.join(__dirname, "output/cache");
var eslintLoader = path.join(__dirname, "../index");

var globalConfig = {
  entry: path.join(__dirname, "fixtures/cache.js"),
  module: {
    rules: [
      {
        test: /\.js$/,
        use: eslintLoader,
        exclude: /node_modules/
      }
    ]
  }
};

// Create a separate directory for each test so that the tests
// can run in parallel

test.cb.beforeEach(t => {
  createTestDirectory(outputDir, t.title, (err, directory) => {
    if (err) return t.end(err);
    t.context.directory = directory;
    t.end();
  });
});
test.cb.beforeEach(t => {
  createTestDirectory(cacheDir, t.title, (err, directory) => {
    if (err) return t.end(err);
    t.context.cache = directory;
    t.end();
  });
});
test.cb.beforeEach(t => rimraf(defaultCacheDir, t.end));
test.cb.afterEach(t => rimraf(t.context.directory, t.end));
test.cb.afterEach(t => rimraf(t.context.cache, t.end));

test.cb("should output files to cache directory", t => {
  var config = assign({}, globalConfig, {
    output: {
      path: t.context.directory
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          use: `${eslintLoader}?cache=${t.context.cache}`,
          exclude: /node_modules/
        }
      ]
    }
  });

  webpack(config, err => {
    t.is(err, null);

    fs.readdir(t.context.cache, (err, files) => {
      // console.log("CACHE SETTING:", t.context.cache)
      t.is(err, null);
      t.true(files.length > 0);
      t.end();
    });
  });
});

test.cb.serial(
  "should output json.gz files to standard cache dir by default",
  t => {
    var config = assign({}, globalConfig, {
      output: {
        path: t.context.directory
      },
      module: {
        rules: [
          {
            test: /\.jsx?/,
            use: `${eslintLoader}?cache=true`,
            exclude: /node_modules/
          }
        ]
      }
    });

    webpack(config, err => {
      t.is(err, null);

      fs.readdir(defaultCacheDir, (err, files) => {
        // console.log("CACHE SETTING:", t.context.cache)
        files = files.filter(file => /\b[0-9a-f]{5,40}\.json\.gz\b/.test(file));
        t.is(err, null);
        t.true(files.length > 0);
        t.end();
      });
    });
  }
);

test.cb.serial(
  "should output files to standard cache dir if set to true in query",
  t => {
    var config = assign({}, globalConfig, {
      output: {
        path: t.context.directory
      },
      module: {
        rules: [
          {
            test: /\.jsx?/,
            use: `${eslintLoader}?cache=true`,
            exclude: /node_modules/
          }
        ]
      }
    });

    webpack(config, err => {
      t.is(err, null);

      fs.readdir(defaultCacheDir, (err, files) => {
        // console.log("CACHE SETTING:", t.context.cache)
        files = files.filter(file => /\b[0-9a-f]{5,40}\.json\.gz\b/.test(file));

        t.is(err, null);
        t.true(files.length > 0);
        t.end();
      });
    });
  }
);

test.cb.serial("should read from cache directory if cached file exists", t => {
  var config = assign({}, globalConfig, {
    output: {
      path: t.context.directory
    },
    module: {
      rules: [
        {
          test: /\.jsx?/,
          use: `${eslintLoader}?cache=${t.context.cache}`,
          exclude: /node_modules/
        }
      ]
    }
  });

  // @TODO Find a way to know if the file as correctly read without relying on
  // Istanbul for coverage.
  webpack(config, err => {
    t.is(err, null);

    webpack(config, err => {
      t.is(err, null);
      fs.readdir(t.context.cache, (err, files) => {
        t.is(err, null);
        t.true(files.length > 0);
        t.end();
      });
    });
  });
});

test.cb.serial("should have one file per module", t => {
  var config = assign({}, globalConfig, {
    output: {
      path: t.context.directory
    },
    module: {
      rules: [
        {
          test: /\.jsx?/,
          use: `${eslintLoader}?cache=${t.context.cache}`,
          exclude: /node_modules/
        }
      ]
    }
  });

  webpack(config, err => {
    t.is(err, null);

    fs.readdir(t.context.cache, (err, files) => {
      // console.log("CACHE SETTING:", t.context.cache)
      t.is(err, null);
      t.true(files.length === 3);
      t.end();
    });
  });
});

test.cb.serial("should generate a new file if the identifier changes", t => {
  var configs = [
    assign({}, globalConfig, {
      output: {
        path: t.context.directory
      },
      module: {
        rules: [
          {
            test: /\.jsx?/,
            use: `${eslintLoader}?cache=${t.context.cache}&cacheIdentifier=a`,
            exclude: /node_modules/
          }
        ]
      }
    }),
    assign({}, globalConfig, {
      output: {
        path: t.context.directory
      },
      module: {
        rules: [
          {
            test: /\.jsx?/,
            use: `${eslintLoader}?cache=${t.context.cache}&cacheIdentifier=b`,
            exclude: /node_modules/
          }
        ]
      }
    })
  ];
  let counter = configs.length;

  configs.forEach(config => {
    webpack(config, err => {
      t.is(err, null);
      counter -= 1;

      if (!counter) {
        fs.readdir(t.context.cache, (err, files) => {
          if (err) {
            // console.log(err)
          }
          t.is(err, null);
          t.true(files.length === 6);
          t.end();
        });
      }
    });
  });
});

function createTestDirectory(baseDirectory, testTitle, cb) {
  const directory = path.join(baseDirectory, escapeDirectory(testTitle));

  rimraf(directory, err => {
    if (err) return cb(err);
    mkdirp(directory, mkdirErr => cb(mkdirErr, directory));
  });
}

function escapeDirectory(directory) {
  return directory.replace(/[/?<>\\:*|"\s]/g, "_");
}
