import webpack from 'webpack';

import conf from './utils/conf';

describe('parameters', () => {
  it('should supports query strings parameters', (done) => {
    const compiler = webpack(
      conf(
        {
          entry: './test/fixtures/good.js',
        },
        {
          rules: {
            semi: 0,
          },
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
