import fs from 'fs';

import webpack from 'webpack';

import conf from './utils/conf';

describe('autofix stop', () => {
  const entry = './test/fixtures/fixable-clone.js';

  beforeAll(() => {
    fs.copyFileSync('./test/fixtures/fixable.js', entry);
  });

  afterAll(() => {
    fs.unlinkSync(entry);
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
