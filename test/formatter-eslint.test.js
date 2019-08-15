import webpack from 'webpack';

import conf from './utils/conf';

describe('formatter eslint', () => {
  it('should use eslint formatter', (done) => {
    const compiler = webpack(
      conf({
        entry: './test/fixtures/error.js',
      })
    );
    compiler.run((err, stats) => {
      expect(stats.compilation.errors[0].message).toBeTruthy();
      done();
    });
  });
});
