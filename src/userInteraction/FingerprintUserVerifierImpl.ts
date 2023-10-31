/**
 * Copyright © 2023 Nevis Security AG. All rights reserved.
 */

import {
	FingerprintUserVerificationContext,
	FingerprintUserVerificationHandler,
	FingerprintUserVerifier,
} from '@nevis-security/nevis-mobile-authentication-sdk-react';

import { ErrorHandler } from '../error/ErrorHandler';
import { OperationType } from '../model/OperationType';

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

		await handler
			.listenForOsCredentials()
			.catch(ErrorHandler.handle.bind(null, OperationType.unknown));
	}

	onValidCredentialsProvided(): void {
		console.log('Valid fingerprint credentials provided.');
	}
}
