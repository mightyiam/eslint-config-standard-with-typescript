const Parser = require('@typescript-eslint/parser')
const config = require('.')

module.exports = [
  config,
  {
    "files": [
      "**/*.js",
      "**/*.ts",
    ],
    ignores: [
      "lib/**",
    ],
    linterOptions: {
      reportUnusedDisableDirectives: true,
    },
    languageOptions: {
      parser: Parser,
      "parserOptions": {
        "project": "./tsconfig.json"
      }
    },
  }
]
