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

#### `reporter` (default: wrapper eslint stylish reporter)

Loader accepts a function that will have one argument: an array of eslint messages (object).
The function must return the output as a string.

#### Errors and Warning

**By default the loader will auto adjust error reporting depending
on eslint errors/warnings counts.**
You can still force this behavior

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

## [Changelog](CHANGELOG.md)

## [License](LICENSE)
