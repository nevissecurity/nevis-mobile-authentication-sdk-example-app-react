/**
 * Copyright © 2023 Nevis Security AG. All rights reserved.
 */

module.exports = {
	extends: [
		'eslint:recommended',
		'plugin:@typescript-eslint/recommended',
		'plugin:import/typescript',
		'prettier',
	],
	ignorePatterns: ['node_modules/'],
	parser: '@typescript-eslint/parser',
	plugins: ['@typescript-eslint', 'import'],
	root: true,
	settings: {
		'import/resolver': {
			typescript: true,
		},
	},
	rules: {
		'@typescript-eslint/no-explicit-any': 0,
		'@typescript-eslint/no-var-requires': 0,
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
	},
};
