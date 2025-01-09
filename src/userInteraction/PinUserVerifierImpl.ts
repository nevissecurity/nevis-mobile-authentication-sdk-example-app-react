/**
 * Copyright © 2023 Nevis Security AG. All rights reserved.
 */

import {
	PinUserVerificationContext,
	PinUserVerificationHandler,
	PinUserVerifier,
} from '@nevis-security/nevis-mobile-authentication-sdk-react';

import { CredentialKind } from '../model/CredentialKind';
import { CredentialMode } from '../model/CredentialMode';
import * as RootNavigation from '../utility/RootNavigation';

export class PinUserVerifierImpl extends PinUserVerifier {
	verifyPin(
		context: PinUserVerificationContext,
		handler: PinUserVerificationHandler
	): Promise<void> {
		console.log(
			context.lastRecoverableError
				? 'PIN user verification failed. Please try again.'
				: 'Please start PIN user verification.'
		);

		RootNavigation.navigate('Credential', {
			mode: CredentialMode.verification,
			kind: CredentialKind.pin,
			handler: handler,
			lastRecoverableError: context.lastRecoverableError,
			pinProtectionStatus: context.authenticatorProtectionStatus,
		});

		return Promise.resolve();
	}

	onValidCredentialsProvided(): void {
		console.log('Valid pin credentials provided.');
	}
}
