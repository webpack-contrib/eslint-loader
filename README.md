# eslint-loader [![Build Status](http://img.shields.io/travis/MoOx/eslint-loader.svg)](https://travis-ci.org/MoOx/eslint-loader)

> eslint loader for webpack

## Install

```console
$ npm install eslint-loader
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

### Options

You can pass directly some [eslint options](http://eslint.org/docs/user-guide/command-line-interface) by

- Adding a query string to the loader for this loader usabe only

```js
{
  module: {
    loaders: [
      {
        test: /\.js$/,
        loader: "eslint-loader?{rules:[{semi:0}]}",
        exclude: /node_modules/,
      },
    ],
  },
}
```

- Adding an `eslint` entry in you webpack config for global options:

```js
module.exports = {
  eslint: {
    configFile: 'path/.eslintrc'
  }
}
```

**Note that you can use both method in order to benefit from global & specific options**

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

Loader will always returns errors if this option is set to `true`.

```js
module.exports = {
  entry: "...",
  module: {
    // ...
  }
  eslint: {
    emitErrors: true
  }
}
```

##### `emitWarning` (default: `false`)

Loader will always returns warning if option is set to `true`.

#### `quiet` (default: `false`)

Loader will process and report errors only and ignore warnings if this option is set to true

```js
module.exports = {
  entry: "...",
  module: {
    // ...
  }
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
  }
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
  }
  eslint: {
    failOnError: true
  }
}
```

## [Changelog](CHANGELOG.md)

## [License](LICENSE)
