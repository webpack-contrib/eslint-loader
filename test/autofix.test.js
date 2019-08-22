import { copySync, removeSync } from 'fs-extra';
import webpack from 'webpack';

import conf from './utils/conf';

describe('autofix stop', () => {
  const entry = './test/fixtures/fixable-clone.js';

  beforeAll(() => {
    copySync('./test/fixtures/fixable.js', entry);
  });

  afterAll(() => {
    removeSync(entry);
  });

  it('should not throw error if file ok after auto-fixing', (done) => {
    const compiler = webpack(
      conf(
        {
          entry,
        },
        {
          fix: true,
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
