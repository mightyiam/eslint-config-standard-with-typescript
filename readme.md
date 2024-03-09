[![Build Status](https://github.com/mightyiam/eslint-config-standard-with-typescript/actions/workflows/ci.yaml/badge.svg)](https://github.com/mightyiam/eslint-config-standard-with-typescript/actions/workflows/ci.yaml)
[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)
[![npm](https://img.shields.io/npm/v/eslint-config-standard-with-typescript)](https://www.npmjs.com/package/eslint-config-standard-with-typescript)

An ESLint config for TypeScript that is based on [eslint-config-standard](https://github.com/standard/eslint-config-standard) and has TypeScript specific rules from [@typescript-eslint/eslint-plugin](https://www.npmjs.com/package/@typescript-eslint/eslint-plugin).

# @typescript-eslint dependencies

This package has `@typescript-eslint/parser` and `@typescript-eslint/eslint-plugin` in `dependencies`.  
Both are specified as ranges.
It's probably safest for the installed versions of these packages to be the same.
This can be achieved by locking them in `package-lock.json`.

# Yarn

Yarn does not automatically install `peerDependencies`,
so if that's what you're using, install them manually.
Here is an example, but use it only for reference,
because your decisions regarding version ranges and range specifiers may vary.

```
yarn add --dev \
  typescript@\* \
  eslint@^8.0.1 \
  eslint-config-standard-with-typescript@latest
```

# Example config

Here is an example `eslint.config.js`.
Pay close attention to the `files` property, because it [determines which files are linted][specifying-target-files-to-lint].

```js
const standard = require('eslint-config-standard')
module.exports = [

  {
    files: ['*.js', '*.jsx', '*.ts', '*.tsx'],
    extends: 'standard-with-typescript'
  }
]
```

Note: the config exported by this package sets `parserOptions.project = true`.
Read about the `project` option [here](https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/parser/README.md#configuration).

There are [some more `parserOptions`](https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/parser/README.md#configuration) you may care about.

[specifying-target-files-to-lint]: https://eslint.org/docs/latest/use/configure/configuration-files#specifying-target-files-to-lint

# Example command line usage:

```
$ npx eslint .
```
