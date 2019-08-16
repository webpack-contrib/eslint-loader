import { getOptions } from 'loader-utils';
import validateOptions from 'schema-utils';
import objectHash from 'object-hash';
import createCache from 'loader-fs-cache';

import { version } from '../package.json';

import PrintLinterOutput from './PrintLinterOutput';

import { getFormatter, parseResourcePath, lint } from './utils';
import schema from './options.json';

const cache = createCache('eslint-loader');
const engines = {};

export default function loader(content, map) {
  const webpack = this;
  const options = {
    eslintPath: 'eslint',
    ...getOptions(webpack),
  };

  validateOptions(schema, options, {
    name: 'ESLint Loader',
    baseDataPath: 'options',
  });

  const { CLIEngine } = require(options.eslintPath);
  const hash = objectHash(options);

  options.formatter = getFormatter(CLIEngine, options.formatter);

  if (options.outputReport && options.outputReport.formatter) {
    options.outputReport.formatter = getFormatter(
      CLIEngine,
      options.outputReport.formatter
    );
  }

  if (!engines[hash]) {
    engines[hash] = new CLIEngine(options);
  }

  const resourcePath = parseResourcePath(webpack);
  const emitter = options.emitError ? webpack.emitError : webpack.emitWarning;
  const engine = engines[hash];
  const cacheIdentifier = JSON.stringify({
    'eslint-loader': version,
    eslint: CLIEngine.version || 'unknown version',
  });

  webpack.cacheable();

  const printLinterOutput = new PrintLinterOutput(CLIEngine, options, webpack);

  // return early if not cached
  if (!options.cache) {
    printLinterOutput.execute(lint(engine, content, resourcePath, emitter));
    webpack.callback(null, content, map);
    return;
  }

  const callback = webpack.async();

  cache(
    {
      directory: options.cache,
      identifier: cacheIdentifier,
      options,
      source: content,
      transform() {
        return lint(engine, content, resourcePath, emitter);
      },
    },
    (err, res) => {
      // istanbul ignore next
      if (err) {
        return callback(err);
      }

      let error = err;

      try {
        printLinterOutput.execute({ ...res, src: content });
      } catch (e) {
        error = e;
      }

      return callback(error, content, map);
    }
  );
}
