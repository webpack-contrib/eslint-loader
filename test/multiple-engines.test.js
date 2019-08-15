import webpack from 'webpack';

import conf from './utils/conf';

describe('multiple engines', () => {
  it('should will create an engine for each unique config', (done) => {
    const compiler = webpack(
      conf({
        entry: './test/fixtures/good.js',
        module: {
          rules: [
            {
              test: /\.js$/,
              use: "./src/index?{rules:{quotes:[1,'single']}}",
              exclude: /node_modules/,
            },
            {
              test: /\.js$/,
              use: "./src/index?{rules:{semi:[1,'always']}}",
              exclude: /node_modules/,
            },
          ],
        },
      })
    );

    compiler.run((err, stats) => {
      expect(stats.compilation.warnings.length).toBe(2);
      expect(
        stats.compilation.warnings.find((warning) => /quotes/.test(warning))
      ).toBeTruthy();
      expect(
        stats.compilation.warnings.find((warning) => /semi/.test(warning))
      ).toBeTruthy();
      done();
    });
  });
});
