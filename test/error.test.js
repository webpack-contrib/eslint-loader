import webpack from 'webpack';

import conf from './utils/conf';

describe('error', () => {
  it('should return error if file is bad', (done) => {
    const compiler = webpack(
      conf({
        entry: './test/fixtures/error.js',
      })
    );

    compiler.run((err, stats) => {
      expect(stats.hasErrors()).toBe(true);
      done();
    });
  });
});
