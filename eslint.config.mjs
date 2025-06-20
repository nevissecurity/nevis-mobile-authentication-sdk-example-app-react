import { fixupConfigRules, fixupPluginRules } from '@eslint/compat';
import { FlatCompat } from '@eslint/eslintrc';
import js from '@eslint/js';
import typescriptEslint from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import _import from 'eslint-plugin-import';
import react from 'eslint-plugin-react';
import reactNative from 'eslint-plugin-react-native';
import globals from 'globals';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
	baseDirectory: __dirname,
	recommendedConfig: js.configs.recommended,
	allConfig: js.configs.all,
});

export default [
	{
		ignores: ['**/node_modules/'],
	},
	...fixupConfigRules(
		compat.extends(
			'eslint:recommended',
			'plugin:@typescript-eslint/recommended',
			'plugin:react/recommended',
			'plugin:react/jsx-runtime',
			'plugin:import/typescript',
			'prettier'
		)
	),
	{
		plugins: {
			'@typescript-eslint': fixupPluginRules(typescriptEslint),
			'import': fixupPluginRules(_import),
			'react': fixupPluginRules(react),
			'react-native': reactNative,
		},

		languageOptions: {
			globals: {
				...globals.jest,
				...reactNative.environments['react-native']['react-native'],
			},

			parser: tsParser,
		},

		settings: {
			'import/resolver': {
				typescript: true,
			},

			'react': {
				version: 'detect',
			},
		},

		rules: {
			'@typescript-eslint/no-explicit-any': 'off',
			'@typescript-eslint/no-var-requires': 'off',
			'import/no-unresolved': 'error',

			'sort-imports': [
				'error',
				{
					ignoreCase: true,
					ignoreDeclarationSort: true,
				},
			],

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
			'react-native/split-platform-components': 'error',
			'react-native/no-inline-styles': 'error',
			'react-native/no-color-literals': 'error',
			'react-native/no-raw-text': 'error',
			'react-native/no-single-element-style-arrays': 'error',
			'react/jsx-uses-react': 'error',
			'react/jsx-uses-vars': 'error',
		},
	},
];
