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
              exclude: /node_modules/,
              loader: './src/index',
              options: {
                ignore: false,
                rules: {
                  quotes: [1, 'single'],
                },
              },
            },
            {
              test: /\.js$/,
              exclude: /node_modules/,
              loader: './src/index',
              options: {
                ignore: false,
                rules: {
                  semi: [1, 'always'],
                },
              },
            },
          ],
        },
      })
    );

    compiler.run((err, stats) => {
      const { warnings } = stats.compilation;
      const quotes = warnings.find((warning) => /quotes/.test(warning));
      const semi = warnings.find((warning) => /semi/.test(warning));

      expect(warnings.length).toBe(2);
      expect(quotes).toBeTruthy();
      expect(semi).toBeTruthy();
      done();
    });
  });
});
