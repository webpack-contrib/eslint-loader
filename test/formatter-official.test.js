import webpack from 'webpack';

import conf from './utils/conf';

describe('formatter official', () => {
  it('should use official formatter', (done) => {
    const compiler = webpack(
      conf(
        {
          entry: './test/fixtures/error.js',
        },
        {
          formatter: 'table',
        }
      )
    );
    compiler.run((err, stats) => {
      expect(stats.compilation.errors[0].message).toBeTruthy();
      done();
    });
  });
});
