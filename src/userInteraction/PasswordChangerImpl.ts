/**
 * Copyright © 2024 Nevis Security AG. All rights reserved.
 */

import {
	PasswordChangeContext,
	PasswordChangeHandler,
	PasswordChanger,
} from '@nevis-security/nevis-mobile-authentication-sdk-react';

import { PasswordPolicyImpl } from './PasswordPolicyImpl';
import { CredentialKind } from '../model/CredentialKind';
import { CredentialMode } from '../model/CredentialMode';
import * as RootNavigation from '../utility/RootNavigation';

export class PasswordChangerImpl extends PasswordChanger {
	changePassword(context: PasswordChangeContext, handler: PasswordChangeHandler): void {
		console.log(
			context.lastRecoverableError
				? 'Password change failed. Please try again.'
				: 'Please start password change.'
		);

		RootNavigation.navigate('Credential', {
			mode: CredentialMode.change,
			kind: CredentialKind.password,
			handler: handler,
			lastRecoverableError: context.lastRecoverableError,
			passwordProtectionStatus: context.authenticatorProtectionStatus,
		});
	}

	// You can add a custom password policy by overriding the `passwordPolicy` getter.
	passwordPolicy = new PasswordPolicyImpl();
}
