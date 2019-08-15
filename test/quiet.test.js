import webpack from 'webpack';

import conf from './utils/conf';

describe('quiet', () => {
  it('should not emit warnings if quiet is set', (done) => {
    const compiler = webpack(
      conf(
        {
          entry: './test/fixtures/warn.js',
        },
        {
          quiet: true,
        }
      )
    );

    compiler.run((err, stats) => {
      expect(stats.hasWarnings()).toBe(false);
      expect(stats.hasErrors()).toBe(false);
      done();
    });
  });
});
