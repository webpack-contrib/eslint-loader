import process from 'process';

export function lint(engine, content, resourcePath, emitter) {
  try {
    return engine.executeOnText(content, resourcePath, true);
  } catch (_) {
    emitter(_);

    return { src: content };
  }
}

export function getFormatter(CLIEngine, formatter) {
  if (typeof formatter === 'function') {
    return formatter;
  }

  // Try to get oficial formatter
  if (typeof formatter === 'string') {
    try {
      return CLIEngine.getFormatter(formatter);
    } catch (e) {
      // ignored
    }
  }

  return CLIEngine.getFormatter('stylish');
}

export function parseResourcePath(webpack) {
  const cwd = process.cwd();
  let { resourcePath } = webpack;

  // remove cwd from resource path in case webpack has been started from project
  // root, to allow having relative paths in .eslintignore
  // istanbul ignore next
  if (resourcePath.indexOf(cwd) === 0) {
    resourcePath = resourcePath.substr(cwd.length + (cwd === '/' ? 0 : 1));
  }

  return resourcePath;
}
