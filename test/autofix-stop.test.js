import fs from 'fs';

import webpack from 'webpack';

import conf from './utils/conf';

describe('autofix stop', () => {
  const entry = './test/fixtures/nonfixable-clone.js';
  let changed = false;

  beforeAll(() => {
    return fs
      .createReadStream('./test/fixtures/nonfixable.js')
      .pipe(fs.createWriteStream(entry))
      .on('close', () => {
        fs.watch(entry, () => {
          changed = true;
        });
      });
  });

  afterAll(() => {
    fs.unlinkSync(entry);
  });

  it('should not change file if there are no fixable errors/warnings', (done) => {
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

    compiler.run(() => {
      expect(changed).toBe(false);
      done();
    });
  });
});
