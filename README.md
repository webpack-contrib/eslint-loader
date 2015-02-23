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

Loader accepts a function that will have one argument: an array of eslint messages (object)

#### `emitErrors` (default: `false`)

Loader will returns error instead of warning if this option is set to true

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

## [Changelog](CHANGELOG.md)

## [License](LICENSE)
