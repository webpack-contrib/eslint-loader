import webpack from 'webpack';

import conf from './utils/conf';

describe('ok', () => {
  it("should don't throw error if file is ok", (done) => {
    const compiler = webpack(
      conf({
        entry: './test/fixtures/good.js',
      })
    );

    compiler.run((err, stats) => {
      expect(stats.hasWarnings()).toBe(false);
      expect(stats.hasErrors()).toBe(false);
      done();
    });
  });
});
