import type { UserConfig } from '@commitlint/types';

const config: UserConfig = {
	extends: ['@commitlint/config-conventional'],
	rules: {
		'scope-enum': [2, 'always', ['frontend', 'backend', 'shared', 'infra', 'deps', 'root']],
		'scope-empty': [2, 'never'],
		'header-max-length': [2, 'always', 100],
	},
};

export default config;
