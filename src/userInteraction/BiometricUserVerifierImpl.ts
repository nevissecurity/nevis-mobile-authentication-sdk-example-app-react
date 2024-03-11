/**
 * Copyright © 2023 Nevis Security AG. All rights reserved.
 */

import {
	BiometricUserVerificationContext,
	BiometricUserVerificationHandler,
	BiometricUserVerifier,
} from '@nevis-security/nevis-mobile-authentication-sdk-react';

import { AuthenticatorUtils } from '../utility/AuthenticatorUtils';
import * as RootNavigation from '../utility/RootNavigation';

export class BiometricUserVerifierImpl extends BiometricUserVerifier {
	async verifyBiometric(
		context: BiometricUserVerificationContext,
		handler: BiometricUserVerificationHandler
	): Promise<void> {
		console.log('Please start biometric user verification.');
		RootNavigation.navigate('Confirmation', {
			authenticator: AuthenticatorUtils.localizedTitle(context.authenticator),
			handler: handler,
		});
	}

	onValidCredentialsProvided(): void {
		console.log('Valid biometric credentials provided.');
	}
}
