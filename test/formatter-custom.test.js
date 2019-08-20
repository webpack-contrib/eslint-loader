import webpack from 'webpack';

import conf from './utils/conf';

describe('formatter eslint', () => {
  it('should use custom formatter as function', (done) => {
    const compiler = webpack(
      conf(
        {
          entry: './test/fixtures/error.js',
        },
        {
          formatter: require('eslint-friendly-formatter'),
        }
      )
    );

    compiler.run((err, stats) => {
      expect(stats.compilation.errors[0].message).toBeTruthy();
      done();
    });
  });

  it('should use custom formatter as string', (done) => {
    const compiler = webpack(
      conf(
        {
          entry: './test/fixtures/error.js',
        },
        {
          formatter: 'eslint-friendly-formatter',
        }
      )
    );

    compiler.run((err, stats) => {
      expect(stats.compilation.errors[0].message).toBeTruthy();
      done();
    });
  });
});
