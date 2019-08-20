import webpack from 'webpack';

import conf from './utils/conf';

describe('eslintignore', () => {
  it('should ignores files present in .eslintignore', (done) => {
    const compiler = webpack(
      conf(
        {
          entry: './test/fixtures/ignore.js',
        },
        {
          ignore: true,
        }
      )
    );

    compiler.run((err, stats) => {
      expect(stats.hasWarnings()).toBe(false);
      done();
    });
  });
});
