import test from 'ava'
import { type PackageJson } from 'type-fest'
import exported from '.'
import configStandard from './eslint-config-standard'
import { rules as typescriptEslintRules } from '@typescript-eslint/eslint-plugin'
import standardPkg from 'eslint-config-standard/package.json'
import { Linter, ESLint } from 'eslint'
import { readFile } from 'fs/promises'
import { resolve } from 'path'
import npmPkgArg from 'npm-package-arg'
import semver from 'semver'
import structuredClone from '@ungap/structured-clone'

interface PkgDetails {
  pkgPath: string
  pkgJson: PackageJson
  ourDeps: NonNullable<PackageJson['dependencies']>
  ourPeerDeps: NonNullable<PackageJson['peerDependencies']>
  ourDevDeps: NonNullable<PackageJson['devDependencies']>
}

const getPkgDetails = async (): Promise<PkgDetails> => {
  const { readPackageUp } = await import('read-pkg-up')
  const readResult = await readPackageUp()
  if (readResult === undefined) { throw new Error() }
  const ourPkg = readResult.packageJson
  if (ourPkg.dependencies === undefined) { throw new Error() }
  const ourDeps = ourPkg.dependencies
  if (ourPkg.peerDependencies === undefined) { throw new Error() }
  const ourPeerDeps = ourPkg.peerDependencies
  if (ourPkg.devDependencies === undefined) { throw new Error() }
  const ourDevDeps = ourPkg.devDependencies
  return { pkgJson: ourPkg, pkgPath: readResult.path, ourDeps, ourPeerDeps, ourDevDeps }
}

const extractVersionSpec = (range: string): string => range.split('@').slice(-1)[0]

const equivalents = [...(new Linter()).getRules().keys()]
  .filter(name => Object.prototype.hasOwnProperty.call(typescriptEslintRules, name))

const ourRules = exported.rules
if (ourRules === undefined) throw new Error('we seem to be exporting no rules')

const standardRules = configStandard.rules
if (standardRules === undefined) throw new Error('`eslint-config-standard` does not seem to be exporting rules')

const equivalentsNotUsedUpstream = equivalents
  .filter(name => !Object.prototype.hasOwnProperty.call(standardRules, name))

test('export', (t): void => {
  const expected: Linter.Config = {
    extends: 'eslint-config-standard',
    plugins: ['@typescript-eslint'],
    parser: '@typescript-eslint/parser',
    parserOptions: {
      project: true
    },
    rules: {
      'block-spacing': 'off',
      'brace-style': 'off',
      camelcase: 'off',
      'comma-dangle': 'off',
      'comma-spacing': 'off',
      'dot-notation': 'off',
      'func-call-spacing': 'off',
      indent: 'off',
      'key-spacing': 'off',
      'keyword-spacing': 'off',
      'lines-between-class-members': 'off',
      'no-array-constructor': 'off',
      'no-dupe-class-members': 'off',
      'no-extra-parens': 'off',
      'no-loss-of-precision': 'off',
      'no-redeclare': 'off',
      'no-throw-literal': 'off',
      'no-undef': 'off',
      'no-unused-vars': 'off',
      'no-use-before-define': 'off',
      'no-unused-expressions': 'off',
      'no-useless-constructor': 'off',
      'no-void': ['error', { allowAsStatement: true }],
      'object-curly-spacing': 'off',
      quotes: 'off',
      semi: 'off',
      'space-before-blocks': 'off',
      'space-before-function-paren': 'off',
      'space-infix-ops': 'off',
      '@typescript-eslint/adjacent-overload-signatures': 'error',
      '@typescript-eslint/array-type': ['error', { default: 'array-simple' }],
      '@typescript-eslint/await-thenable': 'error',
      '@typescript-eslint/ban-ts-comment': ['error', {
        'ts-expect-error': 'allow-with-description',
        'ts-ignore': true,
        'ts-nocheck': true,
        'ts-check': false,
        minimumDescriptionLength: 3
      }],
      '@typescript-eslint/ban-tslint-comment': 'error',
      '@typescript-eslint/ban-types': ['error', {
        extendDefaults: false,
        types: {
          String: {
            message: 'Use string instead',
            fixWith: 'string'
          },
          Boolean: {
            message: 'Use boolean instead',
            fixWith: 'boolean'
          },
          Number: {
            message: 'Use number instead',
            fixWith: 'number'
          },
          Symbol: {
            message: 'Use symbol instead',
            fixWith: 'symbol'
          },
          BigInt: {
            message: 'Use bigint instead',
            fixWith: 'bigint'
          },
          Function: {
            message: [
              'The `Function` type accepts any function-like value.',
              'It provides no type safety when calling the function, which can be a common source of bugs.',
              'It also accepts things like class declarations, which will throw at runtime as they will not be called with `new`.',
              'If you are expecting the function to accept certain arguments, you should explicitly define the function shape.'
            ].join('\n')
          },
          // object typing
          Object: {
            message: [
              'The `Object` type actually means "any non-nullish value", so it is marginally better than `unknown`.',
              '- If you want a type meaning "any object", you probably want `Record<string, unknown>` instead.',
              '- If you want a type meaning "any value", you probably want `unknown` instead.'
            ].join('\n')
          },
          '{}': {
            message: [
              '`{}` actually means "any non-nullish value".',
              '- If you want a type meaning "any object", you probably want `Record<string, unknown>` instead.',
              '- If you want a type meaning "any value", you probably want `unknown` instead.'
            ].join('\n')
          }
        }
      }],
      '@typescript-eslint/block-spacing': ['error', 'always'],
      '@typescript-eslint/brace-style': ['error', '1tbs', { allowSingleLine: true }],
      '@typescript-eslint/class-literal-property-style': ['error', 'fields'],
      '@typescript-eslint/comma-dangle': ['error', {
        arrays: 'never',
        objects: 'never',
        imports: 'never',
        exports: 'never',
        functions: 'never',
        enums: 'ignore',
        generics: 'ignore',
        tuples: 'ignore'
      }],
      '@typescript-eslint/comma-spacing': ['error', { before: false, after: true }],
      '@typescript-eslint/consistent-generic-constructors': ['error', 'constructor'],
      '@typescript-eslint/consistent-indexed-object-style': ['error', 'record'],
      '@typescript-eslint/consistent-type-assertions': [
        'error',
        {
          assertionStyle: 'as',
          objectLiteralTypeAssertions: 'never'
        }
      ],
      '@typescript-eslint/consistent-type-definitions': ['error', 'interface'],
      '@typescript-eslint/consistent-type-exports': ['error', {
        fixMixedExportsWithInlineTypeSpecifier: true
      }],
      '@typescript-eslint/consistent-type-imports': ['error', {
        prefer: 'type-imports',
        disallowTypeAnnotations: true,
        fixStyle: 'inline-type-imports'
      }],
      '@typescript-eslint/dot-notation': ['error', { allowKeywords: true }],
      '@typescript-eslint/explicit-function-return-type': ['error', {
        allowExpressions: true,
        allowHigherOrderFunctions: true,
        allowTypedFunctionExpressions: true,
        allowDirectConstAssertionInArrowFunctions: true
      }],
      '@typescript-eslint/func-call-spacing': ['error', 'never'],
      '@typescript-eslint/indent': ['error', 2, {
        SwitchCase: 1,
        VariableDeclarator: 1,
        outerIIFEBody: 1,
        MemberExpression: 1,
        FunctionDeclaration: { parameters: 1, body: 1 },
        FunctionExpression: { parameters: 1, body: 1 },
        CallExpression: { arguments: 1 },
        ArrayExpression: 1,
        ObjectExpression: 1,
        ImportDeclaration: 1,
        flatTernaryExpressions: false,
        ignoreComments: false,
        ignoredNodes: ['TemplateLiteral *', 'JSXElement', 'JSXElement > *', 'JSXAttribute', 'JSXIdentifier', 'JSXNamespacedName', 'JSXMemberExpression', 'JSXSpreadAttribute', 'JSXExpressionContainer', 'JSXOpeningElement', 'JSXClosingElement', 'JSXFragment', 'JSXOpeningFragment', 'JSXClosingFragment', 'JSXText', 'JSXEmptyExpression', 'JSXSpreadChild'],
        offsetTernaryExpressions: true
      }],
      '@typescript-eslint/key-spacing': ['error', { beforeColon: false, afterColon: true }],
      '@typescript-eslint/keyword-spacing': ['error', { before: true, after: true }],
      '@typescript-eslint/lines-between-class-members': ['error', 'always', { exceptAfterSingleLine: true }],
      '@typescript-eslint/member-delimiter-style': [
        'error',
        {
          multiline: { delimiter: 'none' },
          singleline: { delimiter: 'comma', requireLast: false }
        }
      ],
      '@typescript-eslint/method-signature-style': 'error',
      '@typescript-eslint/naming-convention': ['error', {
        selector: 'variableLike',
        leadingUnderscore: 'allow',
        trailingUnderscore: 'allow',
        format: ['camelCase', 'PascalCase', 'UPPER_CASE']
      }],
      '@typescript-eslint/no-array-constructor': 'error',
      '@typescript-eslint/no-base-to-string': 'error',
      '@typescript-eslint/no-confusing-void-expression': ['error', { ignoreArrowShorthand: false, ignoreVoidOperator: false }],
      '@typescript-eslint/no-dupe-class-members': 'error',
      '@typescript-eslint/no-dynamic-delete': 'error',
      '@typescript-eslint/no-empty-interface': ['error', { allowSingleExtends: true }],
      '@typescript-eslint/no-extra-non-null-assertion': 'error',
      '@typescript-eslint/no-extraneous-class': ['error', { allowWithDecorator: true }],
      '@typescript-eslint/no-floating-promises': 'error',
      '@typescript-eslint/no-for-in-array': 'error',
      '@typescript-eslint/no-implied-eval': 'error',
      '@typescript-eslint/no-invalid-void-type': 'error',
      '@typescript-eslint/no-loss-of-precision': 'error',
      '@typescript-eslint/no-misused-new': 'error',
      '@typescript-eslint/no-misused-promises': 'error',
      '@typescript-eslint/no-namespace': 'error',
      '@typescript-eslint/no-non-null-asserted-optional-chain': 'error',
      '@typescript-eslint/no-non-null-assertion': 'error',
      '@typescript-eslint/no-this-alias': ['error', { allowDestructuring: true }],
      '@typescript-eslint/no-extra-parens': ['error', 'functions'],
      '@typescript-eslint/no-redeclare': ['error', { builtinGlobals: false }],
      '@typescript-eslint/no-throw-literal': 'error',
      '@typescript-eslint/no-unnecessary-type-assertion': 'error',
      '@typescript-eslint/no-unnecessary-type-constraint': 'error',
      '@typescript-eslint/no-unnecessary-boolean-literal-compare': 'error',
      '@typescript-eslint/no-unused-vars': ['error', { args: 'none', caughtErrors: 'none', ignoreRestSiblings: true, vars: 'all' }],
      '@typescript-eslint/no-use-before-define': ['error', { functions: false, classes: false, enums: false, variables: false, typedefs: false }],
      '@typescript-eslint/no-unused-expressions': ['error', { allowShortCircuit: true, allowTaggedTemplates: true, allowTernary: true }],
      '@typescript-eslint/no-useless-constructor': 'error',
      '@typescript-eslint/no-var-requires': 'error',
      '@typescript-eslint/object-curly-spacing': ['error', 'always'],
      '@typescript-eslint/prefer-function-type': 'error',
      '@typescript-eslint/prefer-includes': 'error',
      '@typescript-eslint/prefer-nullish-coalescing': ['error', { ignoreConditionalTests: false, ignoreMixedLogicalExpressions: false }],
      '@typescript-eslint/prefer-optional-chain': 'error',
      '@typescript-eslint/prefer-readonly': 'error',
      '@typescript-eslint/prefer-reduce-type-parameter': 'error',
      '@typescript-eslint/prefer-ts-expect-error': 'error',
      '@typescript-eslint/promise-function-async': 'error',
      '@typescript-eslint/quotes': ['error', 'single', { avoidEscape: true, allowTemplateLiterals: false }],
      '@typescript-eslint/restrict-plus-operands': ['error', { skipCompoundAssignments: false }],
      '@typescript-eslint/require-array-sort-compare': ['error', { ignoreStringArrays: true }],
      '@typescript-eslint/restrict-template-expressions': ['error', { allowNumber: true }],
      '@typescript-eslint/return-await': ['error', 'always'],
      '@typescript-eslint/semi': ['error', 'never'],
      '@typescript-eslint/space-before-blocks': ['error', 'always'],
      '@typescript-eslint/space-before-function-paren': ['error', 'always'],
      '@typescript-eslint/space-infix-ops': 'error',
      '@typescript-eslint/strict-boolean-expressions': ['error', {
        allowString: false,
        allowNumber: false,
        allowNullableObject: false,
        allowNullableBoolean: false,
        allowNullableString: false,
        allowNullableNumber: false,
        allowAny: false
      }],
      '@typescript-eslint/triple-slash-reference': ['error', { lib: 'never', path: 'never', types: 'never' }],
      '@typescript-eslint/type-annotation-spacing': 'error'
    }
  }

  t.deepEqual(exported, expected)
})

const isSingleCaretRange = (rangeStr: string): boolean => {
  const range = new semver.Range(rangeStr)
  return range.set.length === 1 &&
    range.set[0].length === 2 &&
    range.set[0][0].operator === '>=' &&
    range.set[0][1].operator === '<'
}
const isPinnedRange = (rangeStr: string): boolean => {
  const range = new semver.Range(rangeStr)
  return range.set.length === 1 &&
    range.set[0].length === 1 &&
    range.set[0][0].operator === ''
}

const typescriptEslintBottom = '@typescript-eslint_bottom'
const typescriptEslintBottomPlugin = `${typescriptEslintBottom}/eslint-plugin`
const typescriptEslintBottomParser = `${typescriptEslintBottom}/parser`

test('Dependencies range types', async (t) => {
  const { ourDeps, ourPeerDeps, ourDevDeps } = await getPkgDetails()

  t.deepEqual(Object.keys(ourDeps).sort(), ['@typescript-eslint/parser', 'eslint-config-standard'])
  const eslintConfigStandard = ourDeps['eslint-config-standard']
  if (eslintConfigStandard === undefined) throw new Error()
  t.true(isPinnedRange(eslintConfigStandard), 'eslint-config-standard is pinned')
  const parser = ourDeps['@typescript-eslint/parser']
  if (parser === undefined) throw new Error()
  t.true(isSingleCaretRange(parser), '@typescript-eslint/parser is a single `^` range.')
  const typescriptValue = ourPeerDeps.typescript
  t.is(typescriptValue, '*', 'Peer dependency typescript is `*`')
  const typescriptEslintPluginValue = ourPeerDeps['@typescript-eslint/eslint-plugin']
  if (typescriptEslintPluginValue === undefined) throw new Error()
  t.true(
    isSingleCaretRange(typescriptEslintPluginValue),
    `Peer dependency \`@typescript-eslint/eslint-plugin: ${typescriptEslintPluginValue}\` is a single \`^\` range.`
  )
  for (const [name, spec] of Object.entries(ourDevDeps)) {
    if (spec === undefined) throw new Error()
    if (spec.startsWith('github:')) continue
    const range = name.startsWith(`${typescriptEslintBottom}/`) ? extractVersionSpec(spec) : spec
    t.true(isPinnedRange(range), `Dev dependency \`${name}: ${spec}\` is pinned`)
  }
})

test('Own peerDependencies include those of eslint-config-standard', async (t) => {
  const { ourPeerDeps } = await getPkgDetails()
  Object
    .entries(standardPkg.peerDependencies)
    .forEach(([_name, standardDep]) => {
      // https://github.com/microsoft/TypeScript/pull/12253
      const name = _name as keyof typeof standardPkg.peerDependencies
      const ourDep = ourPeerDeps[name]
      t.is(ourDep, standardDep, name)
    })
})

test('@typescript-eslint/eslint-plugin, dev dep subset of peer dep', async (t) => {
  const { ourPeerDeps, ourDevDeps } = await getPkgDetails()
  const peerDepPluginRange = ourPeerDeps['@typescript-eslint/eslint-plugin']
  if (peerDepPluginRange === undefined) {
    t.fail()
    return
  }
  const devDepPluginRange = ourDevDeps['@typescript-eslint/eslint-plugin']
  if (devDepPluginRange === undefined) throw new Error()
  t.true(semver.subset(devDepPluginRange, peerDepPluginRange))
})

test('devDep plugin range subset of dep parser range', async (t) => {
  const { ourDeps, ourDevDeps } = await getPkgDetails()
  const depParserRange = ourDeps['@typescript-eslint/parser']
  const devPluginRange = ourDevDeps['@typescript-eslint/eslint-plugin']
  if (devPluginRange === undefined) throw new Error()
  if (depParserRange === undefined) throw new Error()
  t.true(semver.subset(devPluginRange, depParserRange))
})

test('Exported rule values do not reference eslint-config-standard ones', (t) => {
  for (const ruleName in configStandard.rules) {
    if (typeof configStandard.rules[ruleName] !== 'object') continue // Non-objects use copy-by-value

    t.false(ourRules[`@typescript-eslint/${ruleName}`] === configStandard.rules[ruleName])
  }
})

test('yarn install args in readme satisfy peerDeps', async (t) => {
  const { pkgJson, pkgPath, ourPeerDeps } = await getPkgDetails()
  const readme = (await readFile(resolve(pkgPath, '..', 'readme.md'))).toString()
  const match = readme.match(/```\n(yarn add .*?)```/s)
  if (match === null) throw new Error("couldn't find yarn add")
  if (match.length === 0) throw new Error('failed to find code block')
  if (match.length > 2) throw new Error('matched multiple code blocks')
  const installArgRanges = Object.fromEntries(
    match[1]
      .replace(/\\/g, '')
      .trim()
      .split('\n')
      .slice(1)
      .map(arg => {
        const { name, fetchSpec: range } = npmPkgArg(arg.trim())
        if (name === null) throw new Error()
        if (range === null) throw new Error()
        return [name, range] as const
      })
      .filter(([name]) => name !== pkgJson.name)
  )
  Object.entries(ourPeerDeps as Record<string, string>).forEach(([name, peerDepRange]) => {
    t.true(Object.prototype.hasOwnProperty.call(installArgRanges, name), `missing peerDep ${name} in install args`)
    const installArgRange = installArgRanges[name]
    t.true(
      semver.subset(installArgRange, peerDepRange),
      `${name} install arg range ${installArgRange} is not a subset of peerDep range ${peerDepRange}`
    )
  })
  const installArgsLength = Object.keys(installArgRanges).length
  const ourPeerDepsLength = Object.keys(ourPeerDeps).length
  t.false(installArgsLength > ourPeerDepsLength, 'more install args than peer deps')
  t.false(ourPeerDepsLength > installArgsLength, 'more peer deps than install args')
})

test('all direct equivalents are used', (t) => {
  const unusedDirectEquivalents = equivalents
    .filter((rule) => Object.prototype.hasOwnProperty.call(standardRules, rule) && !Object.prototype.hasOwnProperty.call(ourRules, `@typescript-eslint/${rule}`))
  t.deepEqual(unusedDirectEquivalents, [])
})

test('configs of equivalents are supersets of upstream', async (t) => {
  const { diff: justDiff } = await import('just-diff')
  equivalents.forEach((ruleName) => {
    const standardRuleConfig = standardRules[ruleName]
    const ourRuleConfig = ourRules[`@typescript-eslint/${ruleName}`]
    const diff = justDiff({ _: standardRuleConfig }, { _: ourRuleConfig })
    diff.forEach((diff) => {
      if (diff.op !== 'add') {
        t.fail()
        t.log(ruleName, diff)
      }
      t.pass()
    })
  })
})

test('all plugin rules are considered', (t) => {
  const intentionallyExcludedRules: string[] = [
  ]
  // Some of these rules may have been considered but the reason for their exclusion
  // is not captured here.
  // This serves as a todo list and should ideally eventually end up empty
  // and then fail upon plugin upgrades where new rules are released.
  const notYetConsideredRules: string[] = [
    'explicit-member-accessibility',
    'explicit-module-boundary-types',
    'member-ordering',
    'no-confusing-non-null-assertion',
    'no-duplicate-enum-values',
    'no-duplicate-type-constituents',
    'no-explicit-any',
    'no-implicit-any-catch',
    'no-import-type-side-effects',
    'no-inferrable-types',
    'no-meaningless-void-operator',
    'no-mixed-enums',
    'no-non-null-asserted-nullish-coalescing',
    'no-parameter-properties',
    'no-redundant-type-constituents',
    'no-require-imports',
    'no-type-alias',
    'no-unnecessary-condition',
    'no-unnecessary-qualifier',
    'no-unnecessary-type-arguments',
    'no-unsafe-argument',
    'no-unsafe-assignment',
    'no-unsafe-call',
    'no-unsafe-declaration-merging',
    'no-unsafe-enum-comparison',
    'no-unsafe-member-access',
    'no-unsafe-return',
    'no-useless-empty-export',
    'non-nullable-type-assertion-style',
    'parameter-properties',
    'prefer-as-const',
    'prefer-enum-initializers',
    'prefer-for-of',
    'prefer-literal-enum-member',
    'prefer-namespace-keyword',
    'prefer-readonly-parameter-types',
    'prefer-regexp-exec',
    'prefer-return-this-type',
    'prefer-string-starts-ends-with',
    'sort-type-constituents',
    'sort-type-union-intersection-members',
    'switch-exhaustiveness-check',
    'typedef',
    'unbound-method',
    'unified-signatures'
  ]
  const assertNotInOurRules = (rule: string): void => {
    const typescriptRule = `@typescript-eslint/${rule}`
    t.false(Object.keys(ourRules).includes(typescriptRule), `Actually, the rule ${typescriptRule} is included!`)
  }
  intentionallyExcludedRules.forEach(assertNotInOurRules)
  notYetConsideredRules.forEach(assertNotInOurRules)
  notYetConsideredRules.forEach((rule) => {
    t.false(equivalentsNotUsedUpstream.includes(rule), `the equivalent rule ${rule} should not be considered because it is not used upstream`)
  })
  const inexplicablyExcludedRules = Object.keys(typescriptEslintRules)
    .filter((rule) => {
      const typescriptRule = `@typescript-eslint/${rule}`
      return !Object.keys(ourRules).includes(typescriptRule) &&
        !intentionallyExcludedRules.includes(rule) &&
        !equivalentsNotUsedUpstream.includes(rule) &&
        !notYetConsideredRules.includes(rule)
    })
  t.deepEqual(inexplicablyExcludedRules, [], 'rules inexplicably excluded')
})

test('our configuration is compatible with the plugin and parser at bottom of peer dep range', async (t) => {
  const { ourPeerDeps, ourDevDeps } = await getPkgDetails()

  const peerDepRange = ourPeerDeps['@typescript-eslint/eslint-plugin']
  if (peerDepRange === undefined) throw new Error()

  const bottomPluginRange = ourDevDeps[typescriptEslintBottomPlugin]
  if (bottomPluginRange === undefined) throw new Error()
  const bottomPluginVersion = extractVersionSpec(bottomPluginRange)
  const bottomParserRange = ourDevDeps[typescriptEslintBottomParser]
  if (bottomParserRange === undefined) throw new Error()
  const bottomParserVersion = extractVersionSpec(bottomParserRange)

  const minPeerDepVersion = semver.minVersion(peerDepRange)
  if (minPeerDepVersion === null) throw new Error()

  t.deepEqual(bottomPluginVersion, minPeerDepVersion.version, 'bottom plugin version is bottom of peer dep')
  t.deepEqual(bottomParserVersion, minPeerDepVersion.version, 'bottom parser version is bottom of peer dep')

  const config = structuredClone(exported)

  config.plugins = [typescriptEslintBottomPlugin]
  config.parser = typescriptEslintBottomParser

  config.rules = Object.fromEntries(
    Object.entries(ourRules).map(([name, config]) => [
      name.replace('@typescript-eslint/', `${typescriptEslintBottom}/`),
      config
    ])
  )

  config.parserOptions = {
    project: './tsconfig.json'
  }

  const eslint = new ESLint({
    useEslintrc: false,
    overrideConfig: config
  })

  const results = await eslint.lintFiles('src/**/*')
  t.true(results.length > 0)
  results.forEach(result => t.deepEqual(result.messages, [], result.filePath))
})
