/**
 * Copyright © 2024 Nevis Security AG. All rights reserved.
 */

import {
	PasswordEnroller,
	PasswordEnrollmentContext,
	PasswordEnrollmentHandler,
} from '@nevis-security/nevis-mobile-authentication-sdk-react';

import { PasswordPolicyImpl } from './PasswordPolicyImpl';
import { CredentialKind } from '../model/CredentialKind';
import { CredentialMode } from '../model/CredentialMode';
import * as RootNavigation from '../utility/RootNavigation';

export class PasswordEnrollerImpl extends PasswordEnroller {
	enrollPassword(context: PasswordEnrollmentContext, handler: PasswordEnrollmentHandler): void {
		console.log(
			context.lastRecoverableError
				? 'Password enrollment failed. Please try again.'
				: 'Please start password enrollment.'
		);

		RootNavigation.navigate('Credential', {
			mode: CredentialMode.enrollment,
			kind: CredentialKind.password,
			handler: handler,
			lastRecoverableError: context.lastRecoverableError,
		});
	}

	onValidCredentialsProvided(): void {
		console.log('Valid password credentials provided.');
	}

	// You can add a custom password policy by overriding the `passwordPolicy` getter.
	passwordPolicy = new PasswordPolicyImpl();
}
