import Linter from '../src/Linter';

const loaderContext = { resourcePath: 'test' };
const options = {
  eslintPath: 'eslint',
  ignore: false,
  formatter: jest.fn(),
};
const res = { results: [{ filePath: '' }] };

describe('Linter', () => {
  const linter = new Linter(loaderContext, options);

  it('should parse undefined results without error', () => {
    // eslint-disable-next-line no-undefined
    expect(linter.parseResults({})).toEqual(undefined);
  });

  it('should parse results correctly', () => {
    expect(linter.parseResults(res)).toEqual([{ filePath: 'test' }]);
  });
});
