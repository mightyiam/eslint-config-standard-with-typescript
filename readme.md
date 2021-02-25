[![Build Status](https://github.com/standard/eslint-config-standard-with-typescript/workflows/tests/badge.svg?branch=master)](https://github.com/standard/eslint-config-standard-with-typescript/actions?query=workflow%3A%22tests%22)
[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)
[![Releases](https://coderelease.io/badge/standard/eslint-config-standard-with-typescript)](https://coderelease.io/github/repository/standard/eslint-config-standard-with-typescript)

# eslint-config-standard-with-typescript

An [ESLint shareable config](https://eslint.org/docs/developer-guide/shareable-configs) for TypeScript that is based on [eslint-config-standard](https://github.com/standard/eslint-config-standard) and has TypeScript specific rules from [@typescript-eslint/eslint-plugin](https://www.npmjs.com/package/@typescript-eslint/eslint-plugin).

## Usage

```
npm install --save-dev eslint@7 eslint-plugin-promise@4 eslint-plugin-import@2 eslint-plugin-node@11 @typescript-eslint/eslint-plugin@4 eslint-config-standard-with-typescript
```

Yes, this is a large number of packages. This is due to [a known limitation in ESLint](https://github.com/eslint/eslint/issues/3458).

This long list of dependencies includes:

1. [ESLint](https://github.com/eslint/eslint)
1. Peer dependencies of [eslint-config-standard](https://github.com/standard/eslint-config-standard)
1. [@typescript-eslint/eslint-plugin](https://www.npmjs.com/package/@typescript-eslint/eslint-plugin); ESLint rules for TypeScript.

Here is an example `.eslintrc.js`:

```js
module.exports = {
  extends: 'standard-with-typescript',
  parserOptions: {
    project: './tsconfig.json'
  }
}
```

Note: Please read some important instructions regarding the `project` option [here](https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/parser/README.md#configuration).

There are [some more `parserOptions`](https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/parser/README.md#configuration) you may care about.

If you're using ESLint v6 make sure you read about [the `--ext` command line option](https://eslint.org/docs/user-guide/command-line-interface#ext).

Example command line usage for ESLint v6:

```
$ npx eslint --ext .js,.ts .
```

Example command line usage for ESLint v7:

```
$ npx eslint .
```
