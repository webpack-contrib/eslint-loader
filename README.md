# eslint-loader [![Build Status](http://img.shields.io/travis/MoOx/eslint-loader.svg)](https://travis-ci.org/MoOx/eslint-loader)

> Webpack loader for cssnext

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

## [Changelog](CHANGELOG)

## [License](LICENSE)
