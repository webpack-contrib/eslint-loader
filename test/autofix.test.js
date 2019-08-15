import fs from 'fs';

import webpack from 'webpack';

import conf from './utils/conf';

describe('autofix stop', () => {
  const entry = './test/fixtures/fixable-clone.js';

  beforeAll(() => {
    fs.createReadStream('./test/fixtures/fixable.js').pipe(
      fs.createWriteStream(entry)
    );
  });

  afterAll(() => {
    fs.unlinkSync(entry);
  });

  it('should not throw error if file ok after auto-fixing', (done) => {
    const compiler = webpack(
      conf({
        entry,
        module: {
          rules: [
            {
              test: /\.js$/,
              use: './src/index?fix=true',
              exclude: /node_modules/,
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
