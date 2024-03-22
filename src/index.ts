import configStandard from './eslint-config-standard'
import { type Linter } from 'eslint'

const equivalents = [
  'block-spacing',
  'comma-spacing',
  'dot-notation',
  'brace-style',
  'func-call-spacing',
  'indent',
  'key-spacing',
  'keyword-spacing',
  'lines-between-class-members',
  'no-array-constructor',
  'no-dupe-class-members',
  'no-extra-parens',
  'no-implied-eval',
  'no-loss-of-precision',
  'no-redeclare',
  'no-throw-literal',
  'no-unused-vars',
  'no-unused-expressions',
  'no-useless-constructor',
  'object-curly-spacing',
  'prefer-promise-reject-errors',
  'quotes',
  'semi',
  'space-before-blocks',
  'space-before-function-paren',
  'space-infix-ops'
] as const

const ruleFromStandard = (name: string): Linter.RuleEntry => {
  if (configStandard.rules === undefined) throw new Error()
  const rule = configStandard.rules[name]
  if (rule === undefined) throw new Error()
  if (typeof rule !== 'object') return rule
  return JSON.parse(JSON.stringify(rule))
}

function fromEntries<T> (iterable: Array<[string, T]>): Record<string, T> {
  return [...iterable].reduce<Record<string, T>>((obj, [key, val]) => {
    obj[key] = val
    return obj
  }, {})
}

const config = {
  extends: 'eslint-config-standard',
  plugins: ['@typescript-eslint'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: true
  },
  rules: {
    'comma-dangle': 'off',

    // TypeScript has this functionality by default:
    'no-undef': 'off',

    // Rules replaced by @typescript-eslint versions:
    ...fromEntries(equivalents.map((name) => [name, 'off'])),
    camelcase: 'off',
    'no-use-before-define': 'off',

    // @typescript-eslint versions of Standard.js rules:
    ...fromEntries(equivalents.map((name) => [`@typescript-eslint/${name}`, ruleFromStandard(name)])),
    '@typescript-eslint/no-use-before-define': ['error', {
      functions: false,
      classes: false,
      enums: false,
      variables: false,
      typedefs: false // Only the TypeScript rule has this option.
    }],

    // Rules exclusive to Standard TypeScript:
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
    '@typescript-eslint/explicit-function-return-type': ['error', {
      allowExpressions: true,
      allowHigherOrderFunctions: true,
      allowTypedFunctionExpressions: true,
      allowDirectConstAssertionInArrowFunctions: true
    }],
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
    '@typescript-eslint/no-base-to-string': 'error',
    '@typescript-eslint/no-confusing-void-expression': ['error', { ignoreArrowShorthand: false, ignoreVoidOperator: false }],
    '@typescript-eslint/no-dynamic-delete': 'error',
    '@typescript-eslint/no-empty-interface': ['error', { allowSingleExtends: true }],
    '@typescript-eslint/no-extra-non-null-assertion': 'error',
    '@typescript-eslint/no-extraneous-class': ['error', { allowWithDecorator: true }],
    '@typescript-eslint/no-floating-promises': 'error',
    '@typescript-eslint/no-for-in-array': 'error',
    '@typescript-eslint/no-invalid-void-type': 'error',
    '@typescript-eslint/no-misused-new': 'error',
    '@typescript-eslint/no-misused-promises': 'error',
    '@typescript-eslint/no-namespace': 'error',
    '@typescript-eslint/no-non-null-asserted-optional-chain': 'error',
    '@typescript-eslint/no-non-null-assertion': 'error',
    '@typescript-eslint/no-this-alias': ['error', { allowDestructuring: true }],
    '@typescript-eslint/no-unnecessary-boolean-literal-compare': 'error',
    '@typescript-eslint/no-unnecessary-type-assertion': 'error',
    '@typescript-eslint/no-unnecessary-type-constraint': 'error',
    '@typescript-eslint/no-unsafe-argument': 'error',
    '@typescript-eslint/no-var-requires': 'error',
    '@typescript-eslint/non-nullable-type-assertion-style': 'error',
    '@typescript-eslint/prefer-function-type': 'error',
    '@typescript-eslint/prefer-includes': 'error',
    '@typescript-eslint/prefer-nullish-coalescing': ['error', { ignoreConditionalTests: false, ignoreMixedLogicalExpressions: false }],
    '@typescript-eslint/prefer-optional-chain': 'error',
    '@typescript-eslint/prefer-readonly': 'error',
    '@typescript-eslint/prefer-reduce-type-parameter': 'error',
    '@typescript-eslint/prefer-return-this-type': 'error',
    '@typescript-eslint/prefer-ts-expect-error': 'error',
    '@typescript-eslint/promise-function-async': 'error',
    '@typescript-eslint/require-array-sort-compare': ['error', { ignoreStringArrays: true }],
    '@typescript-eslint/restrict-plus-operands': ['error', { skipCompoundAssignments: false }],
    '@typescript-eslint/restrict-template-expressions': ['error', { allowNumber: true }],
    '@typescript-eslint/return-await': ['error', 'always'],
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
    '@typescript-eslint/type-annotation-spacing': 'error',
    '@typescript-eslint/unbound-method': ['error', { ignoreStatic: false }],
    'no-void': ['error', { allowAsStatement: true }]
  }
} satisfies Linter.Config

export = config
