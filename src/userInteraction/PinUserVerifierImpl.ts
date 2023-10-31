/**
 * Copyright © 2023 Nevis Security AG. All rights reserved.
 */

import {
	PinUserVerificationContext,
	PinUserVerificationHandler,
	PinUserVerifier,
} from '@nevis-security/nevis-mobile-authentication-sdk-react';

import { PinMode } from '../model/PinMode';
import * as RootNavigation from '../utility/RootNavigation';

export class PinUserVerifierImpl extends PinUserVerifier {
	onValidCredentialsProvided(): void {
		console.log('Valid pin credentials provided.');
	}

	verifyPin(
		context: PinUserVerificationContext,
		handler: PinUserVerificationHandler
	): Promise<void> {
		console.log(
			context.lastRecoverableError
				? 'PIN user verification failed. Please try again.'
				: 'Please start PIN user verification.'
		);

		RootNavigation.navigate('Pin', {
			mode: PinMode.verification,
			handler: handler,
			lastRecoverableError: context.lastRecoverableError,
			authenticatorProtectionStatus: context.authenticatorProtectionStatus,
		});
		return Promise.resolve();
	}
}
