import getOptions from './getOptions';
import Linter from './Linter';
import cacheLoader from './cacheLoader';

export default function loader(content, map) {
  const options = getOptions(this);
  const linter = new Linter(this, options);

  this.cacheable();

  // return early if cached
  if (options.cache) {
    cacheLoader(linter, content, map);
    return;
  }

  linter.printOutput(linter.lint(content));
  this.callback(null, content, map);
}
