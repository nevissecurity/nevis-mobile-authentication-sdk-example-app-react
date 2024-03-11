/**
 * Copyright © 2023 Nevis Security AG. All rights reserved.
 */

import {
	FingerprintUserVerificationContext,
	FingerprintUserVerificationHandler,
	FingerprintUserVerifier,
} from '@nevis-security/nevis-mobile-authentication-sdk-react';

import { AuthenticatorUtils } from '../utility/AuthenticatorUtils';
import * as RootNavigation from '../utility/RootNavigation';

export class FingerprintUserVerifierImpl extends FingerprintUserVerifier {
	async verifyFingerprint(
		context: FingerprintUserVerificationContext,
		handler: FingerprintUserVerificationHandler
	): Promise<void> {
		console.log(
			context.lastRecoverableError
				? `Fingerprint user verification failed. Please try again. Error: ${context.lastRecoverableError.description}`
				: 'Please start fingerprint user verification.'
		);

		RootNavigation.navigate('Confirmation', {
			authenticator: AuthenticatorUtils.localizedTitle(context.authenticator),
			handler: handler,
		});
	}

	onValidCredentialsProvided(): void {
		console.log('Valid fingerprint credentials provided.');
	}
}
