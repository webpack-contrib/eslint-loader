import webpack from 'webpack';

import conf from './utils/conf';

describe('no eslint configuration', () => {
  it('should emit warning when there is no eslint configuration', (done) => {
    const compiler = webpack(
      conf(
        {
          entry: './test/fixtures/good.js',
        },
        {
          cwd: '/',
        }
      )
    );

    compiler.run((err, stats) => {
      expect(stats.hasWarnings()).toBe(true);

      const { warnings } = stats.compilation;
      expect(warnings[0].message).toMatch(/no eslint configuration/i);
      done();
    });
  });
});
