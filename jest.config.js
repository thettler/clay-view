// eslint-disable-next-line import/no-extraneous-dependencies
const deepmerge = require('deepmerge');
const defaultTsPreset = require('@vue/cli-plugin-unit-jest/presets/typescript/jest-preset');

module.exports = deepmerge(
  defaultTsPreset,
  {
    moduleNameMapper: {
      // '^@/(.*)$': '<rootDir>/src/$1',
      vue$: 'vue/dist/vue.common.dev.js',
    },
    globals: {
      'ts-jest': {
        babelConfig: true,
      },
    },
  },
);
