import { join } from 'path';

import webpack from 'webpack';

import conf from './utils/conf';

describe('eslint path', () => {
  it('should use another instance of eslint via eslintPath config', (done) => {
    const compiler = webpack(
      conf(
        {
          entry: './test/fixtures/good.js',
        },
        {
          eslintPath: join(__dirname, 'mock/eslint'),
        }
      )
    );

    compiler.run((err, stats) => {
      expect(stats.hasErrors()).toBe(true);
      expect(stats.compilation.errors[0].message).toContain('Fake error');
      done();
    });
  });
});
