/**
 * Copyright © 2023 Nevis Security AG. All rights reserved.
 */

import {
	PinProtectionStatusLastAttemptFailed,
	PinProtectionStatusUnlocked,
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
		const status = context.authenticatorProtectionStatus;
		if (status instanceof PinProtectionStatusUnlocked)
			console.log('Please start PIN user verification.');
		else if (
			status instanceof PinProtectionStatusLastAttemptFailed &&
			status.remainingRetries > 0
		) {
			console.log('Last PIN user verification attempt failed. Please try again.');
		} else {
			console.log('Last PIN user verification attempt failed.');
		}

		RootNavigation.navigate('Credential', {
			mode: CredentialMode.verification,
			kind: CredentialKind.pin,
			handler: handler,
			pinProtectionStatus: context.authenticatorProtectionStatus,
		});

		return Promise.resolve();
	}

	onValidCredentialsProvided(): void {
		console.log('Valid pin credentials provided.');
	}
}
