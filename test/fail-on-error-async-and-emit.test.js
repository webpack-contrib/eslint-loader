import webpack from 'webpack';

import conf from './utils/conf';

describe('fail on error async and emit', () => {
  it('should emits errors in async mode', (done) => {
    const compiler = webpack(
      conf(
        {
          cache: true,
          entry: './test/fixtures/error.js',
        },
        {
          failOnError: true,
          emitError: true,
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
          failOnError: true,
          emitError: true,
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
