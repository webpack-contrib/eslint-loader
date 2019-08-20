import webpack from 'webpack';

import conf from './utils/conf';

describe('parameters', () => {
  it('should supports query strings parameters', (done) => {
    const compiler = webpack(
      conf({
        entry: './test/fixtures/good.js',
        module: {
          rules: [
            {
              test: /\.js$/,
              exclude: /node_modules/,
              loader: './src/index?{rules:{semi:0},ignore:false}',
            },
          ],
        },
      })
    );

    compiler.run((err, stats) => {
      expect(stats.hasWarnings()).toBe(false);
      expect(stats.hasErrors()).toBe(false);
      done();
    });
  });
});
