/**
 * Copyright © 2024 Nevis Security AG. All rights reserved.
 */

import {
	PasswordUserVerificationContext,
	PasswordUserVerificationHandler,
	PasswordUserVerifier,
} from '@nevis-security/nevis-mobile-authentication-sdk-react';

import { PasswordMode } from '../model/PasswordMode';
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

		RootNavigation.navigate('Password', {
			mode: PasswordMode.verification,
			handler: handler,
			lastRecoverableError: context.lastRecoverableError,
			authenticatorProtectionStatus: context.authenticatorProtectionStatus,
		});
		return Promise.resolve();
	}

	onValidCredentialsProvided(): void {
		console.log('Valid password credentials provided.');
	}
}
