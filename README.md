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

You can pass directly some [eslint options](http://eslint.org/docs/configuring/) by adding an `eslint` entry in you webpack config:

```js
module.exports = {
  eslint: {
    configFile: 'path/.eslintrc'
  }
}
```

#### `reporter` (default: eslint stylish reporter)

Loader accepts a function that will have one argument: an array of eslint messages (object).
The function must return the output as a string.
You can use official eslint reporters.
**Please note that every lines with the filename will be skipped from output**
because of the way the loader use eslint (just with a string of text, not a file - so no filename available)

```js
module.exports = {
  entry: "...",
  module: {
    // ...
  }
  eslint: {
    // several examples !

    // default value
    reporter: require("eslint/lib/formatters/stylish"),

    // community reporter
    reporter: require("eslint-friendly-formatter"),

    // custom reporter
    reporter: function(results) {
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
