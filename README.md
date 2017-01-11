# eslint-loader [![Build Status](http://img.shields.io/travis/MoOx/eslint-loader.svg)](https://travis-ci.org/MoOx/eslint-loader)

> eslint loader for webpack

## Install

```console
$ npm install eslint-loader --save-dev
```

## Usage

In your webpack configuration

```js
module.exports = {
  // ...
  module: {
    loaders: [
      {test: /\.js$/, loader: "eslint-loader", exclude: /node_modules/}
    ]
  }
  // ...
}
```

When using with transpiling loaders (like `babel-loader`), make sure they are in correct order
(bottom to top). Otherwise files will be check after being processed by `babel-loader`

```js
module.exports = {
  // ...
  module: {
    loaders: [
      {test: /\.js$/, loaders: [ "babel-loader", "eslint-loader" ], exclude: /node_modules/},
    ]
  }
  // ...
}
```

To be safe, you can use `preLoaders` section to check source files, not modified
by other loaders (like `babel-loader`)

```js
module.exports = {
  // ...
  module: {
    preLoaders: [
      {test: /\.js$/, loader: "eslint-loader", exclude: /node_modules/}
    ]
  }
  // ...
}
```

[webpack@2.2.0-rc.3 has breaking changes](https://github.com/webpack/webpack/releases).
`preLoaders`  is removed  from the webpack^2.1.0-beta.23. so move it to `rules` and use `enforce: "pre"`  instead.

```js
module.exports = {
  // entry, output, other top-level options ...
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        enforce: 'pre',
        use: [{loader: 'eslint-loader', options: {rules: {semi: 0}}],
      },
      // other rules
    ],
  },
  // no need for plugins
};```

### Options

You can pass [eslint options](http://eslint.org/docs/developer-guide/nodejs-api#cliengine) directly by

- Adding a query string to the loader for this loader usage only

```js
{
  module: {
    preLoaders: [
      {
        test: /\.js$/,
        loader: "eslint-loader?{rules:{semi:0}}",
        exclude: /node_modules/,
      },
    ],
  },
}
```

- Adding an `eslint` entry in your webpack config for global options:

```js
module.exports = {
  eslint: {
    configFile: 'path/.eslintrc'
  }
}
```

Note that the config option you provide will be passed to the `CLIEngine`. This is a different set of options than what you'd specify in `package.json` or `.eslintrc`. See the [eslint docs](http://eslint.org/docs/developer-guide/nodejs-api#cliengine) for more detail.

**Note that you can use both methods in order to benefit from global & specific options**

#### `fix` (default: false)

This option will enable
[ESLint autofix feature](http://eslint.org/docs/user-guide/command-line-interface#fix).

**Be careful: this option might cause webpack to enter an infinite build loop if
some issues cannot be fixed properly.**

#### `cache` (default: false)

This option will enable caching of the linting results into a file.
This is particularly useful in reducing linting time when doing a full build.

The cache file is written to the `./node_modules/.cache` directory, thanks to the usage
of the [find-cache-dir](https://www.npmjs.com/package/find-cache-dir) module.

#### `formatter` (default: eslint stylish formatter)

Loader accepts a function that will have one argument: an array of eslint messages (object).
The function must return the output as a string.
You can use official eslint formatters.

```js
module.exports = {
  entry: "...",
  module: {
    // ...
  }
  eslint: {
    // several examples !

    // default value
    formatter: require("eslint/lib/formatters/stylish"),

    // community formatter
    formatter: require("eslint-friendly-formatter"),

    // custom formatter
    formatter: function(results) {
      // `results` format is available here
      // http://eslint.org/docs/developer-guide/nodejs-api.html#executeonfiles()

      // you should return a string
      // DO NOT USE console.*() directly !
      return "OUTPUT"
    }
  }
}
```

#### Errors and Warning

**By default the loader will auto adjust error reporting depending
on eslint errors/warnings counts.**
You can still force this behavior by using `emitError` **or** `emitWarning` options:

##### `emitError` (default: `false`)

Loader will always return errors if this option is set to `true`.

```js
module.exports = {
  entry: "...",
  module: {
    // ...
  },
  eslint: {
    emitError: true
  }
}
```

##### `emitWarning` (default: `false`)

Loader will always return warnings if option is set to `true`.

#### `quiet` (default: `false`)

Loader will process and report errors only and ignore warnings if this option is set to true

```js
module.exports = {
  entry: "...",
  module: {
    // ...
  },
  eslint: {
    quiet: true
  }
}
```

##### `failOnWarning` (default: `false`)

Loader will cause the module build to fail if there are any eslint warnings.

```js
module.exports = {
  entry: "...",
  module: {
    // ...
  },
  eslint: {
    failOnWarning: true
  }
}
```

##### `failOnError` (default: `false`)

Loader will cause the module build to fail if there are any eslint errors.

```js
module.exports = {
  entry: "...",
  module: {
    // ...
  },
  eslint: {
    failOnError: true
  }
}
```

##### `outputReport` (default: `false`)
Write the output of the errors to a file, for example a checkstyle xml file for use for reporting on Jenkins CI

The `filePath` is relative to the webpack config: output.path
You can pass in a different formatter for the output file, if none is passed in the default/configured formatter will be used

```js
module.exports = {
  entry: "...",
  module: {
    // ...
  },
  eslint: {
    outputReport: {
      filePath: 'checkstyle.xml',
      formatter: require('eslint/lib/formatters/checkstyle')
    }
  }
}
```


## Gotchas

### NoErrorsPlugin

`NoErrorsPlugin` prevents Webpack from outputting anything into a bundle. So even ESLint warnings
will fail the build. No matter what error settings are used for `eslint-loader`.

So if you want to see ESLint warnings in console during development using `WebpackDevServer`
remove `NoErrorsPlugin` from webpack config.

### Defining `configFile` or using `eslint -c path/.eslintrc`

Bear in mind that when you define `configFile`, `eslint` doesn't automatically look for
`.eslintrc` files in the directory of the file to be linted. More information is available
in official eslint documentation in section [_Using Configuration Files_](http://eslint.org/docs/user-guide/configuring#using-configuration-files).

Related issues: [#129](https://github.com/MoOx/eslint-loader/issues/129).

## [Changelog](CHANGELOG.md)

## [License](LICENSE)
