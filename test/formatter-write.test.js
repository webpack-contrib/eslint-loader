import { readFileSync } from 'fs';

import { CLIEngine } from 'eslint';

import webpack from 'webpack';

import conf from './utils/conf';

describe('formatter write', () => {
  it('should configured to write eslint results to a file', (done) => {
    const outputFilename = 'outputReport.txt';
    const config = conf(
      {
        entry: './test/fixtures/error.js',
      },
      {
        formatter: CLIEngine.getFormatter('checkstyle'),
        outputReport: {
          filePath: outputFilename,
        },
      }
    );

    const compiler = webpack(config);

    compiler.run((err, stats) => {
      const filePath = `${config.output.path}${outputFilename}`;
      const contents = readFileSync(filePath, 'utf8');

      expect(stats.compilation.errors[0].error.message).toBe(contents);
      done();
    });
  });
});
