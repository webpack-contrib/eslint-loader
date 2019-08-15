import webpack from 'webpack';

import conf from './utils/conf';

describe('force emit error', () => {
  it('should force to emit error', (done) => {
    const compiler = webpack(
      conf(
        {
          entry: './test/fixtures/warn.js',
        },
        {
          emitError: true,
        }
      )
    );
    compiler.run((err, stats) => {
      expect(stats.hasWarnings()).toBe(false);
      expect(stats.hasErrors()).toBe(true);
      done();
    });
  });
});
