/**
 * Copyright © 2023 Nevis Security AG. All rights reserved.
 */

module.exports = {
	ignorePatterns: ['node_modules/'],
	parser: '@typescript-eslint/parser',
	parserOptions: {
		ecmaFeatures: {
			jsx: true,
		},
	},
	env: {
		'jest': false,
		'react-native/react-native': true,
	},
	plugins: ['@typescript-eslint', 'import', 'react', 'react-native'],
	extends: [
		'eslint:recommended',
		'plugin:@typescript-eslint/recommended',
		'plugin:react/recommended',
		'plugin:react/jsx-runtime',
		'plugin:import/typescript',
		'prettier',
	],
	root: true,
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
		'react-native/split-platform-components': 'error',
		'react-native/no-inline-styles': 'error',
		'react-native/no-color-literals': 'error',
		'react-native/no-raw-text': 'error',
		'react-native/no-single-element-style-arrays': 'error',
		'react/jsx-uses-react': 'error',
		'react/jsx-uses-vars': 'error',
	},
};
