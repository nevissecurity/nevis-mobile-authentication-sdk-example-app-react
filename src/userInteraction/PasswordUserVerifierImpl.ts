/**
 * Copyright © 2024 Nevis Security AG. All rights reserved.
 */

import {
	PasswordUserVerificationContext,
	PasswordUserVerificationHandler,
	PasswordUserVerifier,
} from '@nevis-security/nevis-mobile-authentication-sdk-react';

import { CredentialKind } from '../model/CredentialKind';
import { CredentialMode } from '../model/CredentialMode';
import * as RootNavigation from '../utility/RootNavigation';

export class PasswordUserVerifierImpl extends PasswordUserVerifier {
	verifyPassword(
		context: PasswordUserVerificationContext,
		handler: PasswordUserVerificationHandler
	): Promise<void> {
		console.log(
			context.lastRecoverableError
				? 'Password user verification failed. Please try again.'
				: 'Please start password user verification.'
		);

		RootNavigation.navigate('Credential', {
			mode: CredentialMode.verification,
			kind: CredentialKind.password,
			handler: handler,
			lastRecoverableError: context.lastRecoverableError,
			passwordProtectionStatus: context.authenticatorProtectionStatus,
		});

		return Promise.resolve();
	}

	onValidCredentialsProvided(): void {
		console.log('Valid password credentials provided.');
	}
}
