/**
 * Copyright © 2024 Nevis Security AG. All rights reserved.
 */

import {
	PasswordProtectionStatusLastAttemptFailed,
	PasswordProtectionStatusUnlocked,
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
		const status = context.authenticatorProtectionStatus;
		if (status instanceof PasswordProtectionStatusUnlocked)
			console.log('Please start password user verification.');
		else if (
			status instanceof PasswordProtectionStatusLastAttemptFailed &&
			status.remainingRetries > 0
		) {
			console.log('Last password user verification attempt failed. Please try again.');
		} else {
			console.log('Last password user verification attempt failed.');
		}

		RootNavigation.navigate('Credential', {
			mode: CredentialMode.verification,
			kind: CredentialKind.password,
			handler: handler,
			passwordProtectionStatus: context.authenticatorProtectionStatus,
		});

		return Promise.resolve();
	}

	onValidCredentialsProvided(): void {
		console.log('Valid password credentials provided.');
	}
}
