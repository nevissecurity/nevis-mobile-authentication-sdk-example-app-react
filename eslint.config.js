/**
 * Copyright © 2023 Nevis Security AG. All rights reserved.
 */

const eslintrc = require('@eslint/eslintrc');

const compat = new eslintrc.FlatCompat({
	baseDirectory: __dirname,
});

const tsParser = require('@typescript-eslint/parser');
const eslintConfigJs = require('@eslint/js');
const eslintConfigPrettier = require('eslint-config-prettier');
const eslintPluginTs = require('@typescript-eslint/eslint-plugin');
const eslintPluginImport = require('eslint-plugin-import');
const eslintPluginReact = require('eslint-plugin-react');
const eslintPluginReactNative = require('eslint-plugin-react-native');

module.exports = [
	eslintConfigJs.configs.recommended,
	...compat.extends(
		'plugin:@typescript-eslint/recommended',
		'plugin:react/recommended',
		'plugin:react/jsx-runtime',
		'plugin:react-hooks/recommended'
	),
	eslintPluginImport.configs.typescript,
	eslintConfigPrettier,
	{
		files: ['src/**/*.{js,ts,/**/tsx}'],
		ignores: ['node_modules/'],
		languageOptions: {
			parser: tsParser,
			parserOptions: {
				ecmaFeatures: {
					jsx: true,
				},
			},
			globals: {},
		},
		settings: {
			'import/resolver': {
				typescript: true,
			},
			'react': {
				version: 'detect',
			},
		},
		plugins: {
			'@typescript-eslint': eslintPluginTs,
			'import': eslintPluginImport,
			'react': eslintPluginReact,
			'react-native': eslintPluginReactNative,
		},
		rules: {
			'@typescript-eslint/no-explicit-any': 'off',
			'@typescript-eslint/no-var-requires': 'off',
			'import/no-unresolved': 'error',
			// this is for sorting WITHIN an import
			'sort-imports': ['error', { ignoreCase: true, ignoreDeclarationSort: true }],
			// this is for sorting imports
			'import/order': [
				'error',
				{
					'groups': [['external', 'builtin'], 'internal', ['sibling', 'parent'], 'index'],
					'pathGroups': [
						{
							pattern: '@(react|react-native)',
							group: 'external',
							position: 'before',
						},
						{
							pattern: '@src/**',
							group: 'internal',
						},
					],
					'pathGroupsExcludedImportTypes': ['internal', 'react'],
					'newlines-between': 'always',
					'alphabetize': {
						order: 'asc',
						caseInsensitive: true,
					},
				},
			],
			'react-native/no-unused-styles': 'error',
			'react-native/no-inline-styles': 'error',
			'react-native/no-color-literals': 'error',
			'react-native/sort-styles': 'error',
			'react-native/split-platform-components': 'error',
			'react-native/no-raw-text': 'error',
			'react-native/no-single-element-style-arrays': 'error',
			'react/jsx-uses-react': 'error',
			'react/jsx-uses-vars': 'error',
		},
	},
];
