import webpack from 'webpack';

import conf from './utils/conf';

describe('fail on warning', () => {
  it('should emits errors', (done) => {
    const compiler = webpack(
      conf(
        {
          cache: true,
          entry: './test/fixtures/warn.js',
        },
        {
          failOnWarning: true,
          cache: true,
        }
      )
    );

    compiler.run((err, stats) => {
      expect(stats.hasErrors()).toBe(true);
      done();
    });
  });

  it('should correctly indentifies a success', (done) => {
    const compiler = webpack(
      conf(
        {
          cache: true,
          entry: './test/fixtures/good.js',
        },
        {
          failOnWarning: true,
          cache: true,
        }
      )
    );
    compiler.run((err, stats) => {
      expect(stats.hasErrors()).toBe(false);
      done();
    });
  });
});
