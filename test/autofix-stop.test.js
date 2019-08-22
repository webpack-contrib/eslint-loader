import fs from 'fs';

import webpack from 'webpack';
import chokidar from 'chokidar';

import conf from './utils/conf';

describe('autofix stop', () => {
  const entry = './test/fixtures/nonfixable-clone.js';
  let changed = false;
  let watcher;

  beforeAll(() => {
    fs.copyFileSync('./test/fixtures/nonfixable.js', entry);

    watcher = chokidar.watch(entry);
    watcher.on('change', () => {
      changed = true;
    });
  });

  afterAll(() => {
    watcher.close();
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
