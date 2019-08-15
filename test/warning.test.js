import webpack from 'webpack';

import conf from './utils/conf';

describe('warning', () => {
  it('should emit warnings', (done) => {
    const compiler = webpack(
      conf({
        entry: './test/fixtures/warn.js',
      })
    );

    compiler.run((err, stats) => {
      expect(stats.hasWarnings()).toBe(true);
      expect(stats.hasErrors()).toBe(false);
      done();
    });
  });
});
