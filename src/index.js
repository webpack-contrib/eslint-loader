import loaderUtils from 'loader-utils';
import objectHash from 'object-hash';
import createCache from 'loader-fs-cache';

import pkg from '../package.json';

import printLinterOutput from './printLinterOutput';

const cache = createCache('eslint-loader');
const engines = {};

export default function loader(content, map) {
  const webpack = this;

  const userOptions = {
    // user defaults
    ...((webpack.options && webpack.options.eslint) || webpack.query || {}),
    // loader query string
    ...loaderUtils.getOptions(webpack),
  };

  const eslintPkgPath = 'eslint/package.json';
  let userEslintPath = eslintPkgPath;

  if (userOptions.eslintPath) {
    userEslintPath = `${userOptions.eslintPath}/package.json`;
  }

  let eslintVersion;

  try {
    eslintVersion = require(require.resolve(userEslintPath)).version;
  } catch (_) {
    // ignored
  }

  if (!eslintVersion) {
    try {
      eslintVersion = require(require.resolve(eslintPkgPath)).version;
    } catch (_) {
      // ignored
    }
  }

  const config = {
    cacheIdentifier: JSON.stringify({
      'eslint-loader': pkg.version,
      eslint: eslintVersion || 'unknown version',
    }),
    eslintPath: 'eslint',
    ...userOptions,
  };

  const cacheDirectory = config.cache;
  const { cacheIdentifier } = config;

  delete config.cacheIdentifier;

  // Create the engine only once per config
  const configHash = objectHash(config);

  if (!engines[configHash]) {
    const eslint = require(config.eslintPath);
    engines[configHash] = new eslint.CLIEngine(config);
  }

  // Try to get oficial formatter
  if (typeof config.formatter === 'string') {
    try {
      config.formatter = engines[configHash].getFormatter(config.formatter);
    } catch (e) {
      try {
        config.formatter = require(config.formatter);
        if (
          config.formatter &&
          typeof config.formatter !== 'function' &&
          typeof config.formatter.default === 'function'
        ) {
          config.formatter = config.formatter.default;
        }
      } catch (_) {
        // ignored
      }
    }
  }

  // Get default formatter `stylish` when not defined
  if (config.formatter == null || typeof config.formatter !== 'function') {
    config.formatter = engines[configHash].getFormatter('stylish');
  }

  webpack.cacheable();

  const emitter = config.emitError ? webpack.emitError : webpack.emitWarning;
  const engine = engines[configHash];
  let { resourcePath } = webpack;
  const cwd = process.cwd();

  // remove cwd from resource path in case webpack has been started from project
  // root, to allow having relative paths in .eslintignore
  if (resourcePath.indexOf(cwd) === 0) {
    resourcePath = resourcePath.substr(cwd.length + 1);
  }

  // return early if cached
  if (config.cache) {
    const callback = webpack.async();

    cache(
      {
        directory: cacheDirectory,
        identifier: cacheIdentifier,
        options: config,
        source: content,
        transform() {
          return lint(engine, content, resourcePath, emitter);
        },
      },
      (err, res) => {
        if (err) {
          return callback(err);
        }

        let error = err;

        try {
          printLinterOutput(
            {
              ...{},
              ...(res || {}),
              src: content,
            },
            config,
            webpack
          );
        } catch (e) {
          error = e;
        }

        return callback(error, content, map);
      }
    );
    return;
  }

  printLinterOutput(
    lint(engine, content, resourcePath, emitter),
    config,
    webpack
  );

  webpack.callback(null, content, map);
}

function lint(engine, content, resourcePath, emitter) {
  try {
    return engine.executeOnText(content, resourcePath, true);
  } catch (_) {
    if (emitter) emitter(_);

    return { src: content };
  }
}
