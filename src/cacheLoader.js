import createCache from 'loader-fs-cache';

import { version } from '../package.json';

const cache = createCache('eslint-loader');

export default function cacheLoader(linter, content, map) {
  const { loaderContext, options, CLIEngine } = linter;
  const callback = loaderContext.async();
  const cacheIdentifier = JSON.stringify({
    'eslint-loader': version,
    eslint: CLIEngine.version,
  });

  cache(
    {
      directory: options.cache,
      identifier: cacheIdentifier,
      options,
      source: content,
      transform() {
        return linter.lint(content);
      },
    },
    (err, res) => {
      // istanbul ignore next
      if (err) {
        return callback(err);
      }

      let error = err;

      try {
        linter.printOutput({ ...res, src: content });
      } catch (e) {
        error = e;
      }

      return callback(error, content, map);
    }
  );
}
