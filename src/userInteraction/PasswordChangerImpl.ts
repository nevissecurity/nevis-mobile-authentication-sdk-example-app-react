/**
 * Copyright © 2024 Nevis Security AG. All rights reserved.
 */

import {
	PasswordChangeContext,
	PasswordChangeHandler,
	PasswordChanger,
} from '@nevis-security/nevis-mobile-authentication-sdk-react';

import { PasswordPolicyImpl } from './PasswordPolicyImpl';
import { PasswordMode } from '../model/PasswordMode';
import * as RootNavigation from '../utility/RootNavigation';

export class PasswordChangerImpl extends PasswordChanger {
	changePassword(context: PasswordChangeContext, handler: PasswordChangeHandler): void {
		console.log(
			context.lastRecoverableError
				? 'Password change failed. Please try again.'
				: 'Please start password change.'
		);

		RootNavigation.navigate('Password', {
			mode: PasswordMode.credentialChange,
			handler: handler,
			lastRecoverableError: context.lastRecoverableError,
			authenticatorProtectionStatus: context.authenticatorProtectionStatus,
		});
	}

	// You can add a custom password policy by overriding the `passwordPolicy` getter.
	passwordPolicy = new PasswordPolicyImpl();
}
