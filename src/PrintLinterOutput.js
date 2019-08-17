import { isAbsolute, join } from 'path';
import { writeFileSync } from 'fs';

import { interpolateName } from 'loader-utils';

import ESLintError from './ESLintError';

export default class PrintLinterOutput {
  constructor(CLIEngine, options, webpack) {
    this.CLIEngine = CLIEngine;
    this.options = options;
    this.webpack = webpack;
  }

  execute(data) {
    const { options } = this;

    // skip ignored file warning
    if (this.constructor.skipIgnoredFileWarning(data)) {
      return;
    }

    // quiet filter done now
    // eslint allow rules to be specified in the input between comments
    // so we can found warnings defined in the input itself
    const res = this.filter(data);

    // if enabled, use eslint auto-fixing where possible
    if (options.fix) {
      this.autoFix(res);
    }

    // skip if no errors or warnings
    if (res.errorCount < 1 && res.warningCount < 1) {
      return;
    }

    const results = this.parseResults(res);
    const messages = options.formatter(results);

    this.reportOutput(results, messages);
    this.failOnErrorOrWarning(res, messages);

    const emitter = this.getEmitter(res);
    emitter(new ESLintError(messages));
  }

  static skipIgnoredFileWarning(res) {
    return (
      res.warningCount === 1 &&
      res.results[0].messages[0] &&
      res.results[0].messages[0].message &&
      res.results[0].messages[0].message.indexOf('ignore') > 1
    );
  }

  filter(data) {
    const res = data;

    // quiet filter done now
    // eslint allow rules to be specified in the input between comments
    // so we can found warnings defined in the input itself
    if (this.options.quiet && res.warningCount) {
      res.warningCount = 0;
      res.results[0].warningCount = 0;
      res.results[0].messages = res.results[0].messages.filter(
        (message) => message.severity !== 1
      );
    }

    return res;
  }

  autoFix(res) {
    if (
      res.results[0].output !== res.src ||
      res.results[0].fixableErrorCount > 0 ||
      res.results[0].fixableWarningCount > 0
    ) {
      this.CLIEngine.outputFixes(res);
    }
  }

  parseResults({ results }) {
    // add filename for each results so formatter can have relevant filename
    results.forEach((r) => {
      // eslint-disable-next-line no-param-reassign
      r.filePath = this.webpack.resourcePath;
    });

    return results;
  }

  reportOutput(results, messages) {
    const { outputReport } = this.options;

    if (!outputReport || !outputReport.filePath) {
      return;
    }

    let content = messages;

    // if a different formatter is passed in as an option use that
    if (outputReport.formatter) {
      content = outputReport.formatter(results);
    }

    let filePath = interpolateName(this.webpack, outputReport.filePath, {
      content,
    });

    if (!isAbsolute(filePath)) {
      filePath = join(
        // eslint-disable-next-line no-underscore-dangle
        this.webpack._compiler.options.output.path,
        filePath
      );
    }

    writeFileSync(filePath, content);
  }

  failOnErrorOrWarning({ errorCount, warningCount }, messages) {
    const { failOnError, failOnWarning } = this.options;

    if (failOnError && errorCount) {
      throw new ESLintError(
        `Module failed because of a eslint error.\n${messages}`
      );
    }

    if (failOnWarning && warningCount) {
      throw new ESLintError(
        `Module failed because of a eslint warning.\n${messages}`
      );
    }
  }

  getEmitter({ errorCount }) {
    const { options, webpack } = this;

    // default behavior: emit error only if we have errors
    let emitter = errorCount ? webpack.emitError : webpack.emitWarning;

    // force emitError or emitWarning if user want this
    if (options.emitError) {
      emitter = webpack.emitError;
    } else if (options.emitWarning) {
      emitter = webpack.emitWarning;
    }

    return emitter;
  }
}
