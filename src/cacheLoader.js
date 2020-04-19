import { version } from '../package.json';

import cache from './cache';

export default function cacheLoader(linter, content, map) {
  const { loaderContext, options, CLIEngine } = linter;
  const callback = loaderContext.async();
  const cacheIdentifier = JSON.stringify({
    'eslint-loader': version,
    eslint: CLIEngine.version,
  });

  cache({
    cacheDirectory: options.cache,
    cacheIdentifier,
    cacheCompression: true,
    options,
    source: content,
    transform() {
      return linter.lint(content);
    },
  })
    .then((res) => {
      try {
        linter.printOutput({ ...res, src: content });
      } catch (error) {
        return callback(error, content, map);
      }
      return callback(null, content, map);
    })
    .catch((err) => {
      // istanbul ignore next
      return callback(err);
    });
}
