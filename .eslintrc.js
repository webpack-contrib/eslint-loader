module.exports = {
  root: true,
  extends: ['@webpack-contrib/eslint-config-webpack', 'prettier'],
  rules: {
    'global-require': 'off',
    'import/no-dynamic-require': 'off',
  },
};
