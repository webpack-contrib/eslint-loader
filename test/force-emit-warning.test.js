import webpack from 'webpack';

import conf from './utils/conf';

describe('force emit warning', () => {
  it('should force to emit warning', (done) => {
    const compiler = webpack(
      conf(
        {
          entry: './test/fixtures/error.js',
        },
        {
          emitWarning: true,
        }
      )
    );

    compiler.run((err, stats) => {
      expect(stats.hasWarnings()).toBe(true);
      expect(stats.hasErrors()).toBe(false);
      done();
    });
  });
});
