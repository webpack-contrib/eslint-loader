import { interpolateName } from 'loader-utils';

import ESLintError from './ESLintError';

export default function printLinterOutput(res, config, webpack) {
  // skip ignored file warning
  if (
    res.warningCount === 1 &&
    res.results[0].messages[0] &&
    res.results[0].messages[0].message &&
    res.results[0].messages[0].message.indexOf('ignore') > 1
  ) {
    return;
  }

  // quiet filter done now
  // eslint allow rules to be specified in the input between comments
  // so we can found warnings defined in the input itself
  if (res.warningCount && config.quiet) {
    /* eslint-disable no-param-reassign */
    res.warningCount = 0;
    res.results[0].warningCount = 0;
    res.results[0].messages = res.results[0].messages.filter(
      (message) => message.severity !== 1
    );
    /* eslint-enable no-param-reassign */
  }

  // if enabled, use eslint auto-fixing where possible
  if (
    config.fix &&
    (res.results[0].output !== res.src ||
      res.results[0].fixableErrorCount > 0 ||
      res.results[0].fixableWarningCount > 0)
  ) {
    const eslint = require(config.eslintPath);
    eslint.CLIEngine.outputFixes(res);
  }

  if (res.errorCount < 1 && res.warningCount < 1) {
    return;
  }

  // add filename for each results so formatter can have relevant filename
  res.results.forEach((r) => {
    /* eslint-disable-next-line no-param-reassign */
    r.filePath = webpack.resourcePath;
  });

  const messages = config.formatter(res.results);

  if (config.outputReport && config.outputReport.filePath) {
    let reportOutput;
    // if a different formatter is passed in as an option use that
    if (config.outputReport.formatter) {
      reportOutput = config.outputReport.formatter(res.results);
    } else {
      reportOutput = messages;
    }

    const filePath = interpolateName(webpack, config.outputReport.filePath, {
      content: res.results.map((r) => r.source).join('\n'),
    });
    webpack.emitFile(filePath, reportOutput);
  }

  // default behavior: emit error only if we have errors
  let emitter = res.errorCount ? webpack.emitError : webpack.emitWarning;

  // force emitError or emitWarning if user want this
  if (config.emitError) {
    emitter = webpack.emitError;
  } else if (config.emitWarning) {
    emitter = webpack.emitWarning;
  }

  if (!emitter) {
    throw new Error(
      `Your module system doesn't support emitWarning. Update available?\n${messages}`
    );
  }

  if (config.failOnError && res.errorCount) {
    throw new ESLintError(
      `Module failed because of a eslint error.\n${messages}`
    );
  }

  if (config.failOnWarning && res.warningCount) {
    throw new ESLintError(
      `Module failed because of a eslint warning.\n${messages}`
    );
  }

  emitter(new ESLintError(messages));
}
