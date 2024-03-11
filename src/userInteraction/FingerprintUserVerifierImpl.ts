/**
 * Copyright © 2023 Nevis Security AG. All rights reserved.
 */

import { Platform } from 'react-native';

import {
	FingerprintUserVerificationContext,
	FingerprintUserVerificationHandler,
	FingerprintUserVerifier,
	OsAuthenticationListenHandler,
} from '@nevis-security/nevis-mobile-authentication-sdk-react';

import { ErrorHandler } from '../error/ErrorHandler';
import { eventEmitter, EventType } from '../event/EventEmitter';
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

		return Platform.select({
			ios: async () => {
				// on iOS, there is no need to show a popup and give ability to the user to cancel
				// TouchID authentication since the OS shows a dialog by default
				await handler
					.listenForOsCredentials()
					.catch(ErrorHandler.handle.bind(null, OperationType.unknown));
			},
			android: async () => {
				// Object destructuring is not supported by NMA React Native plugin
				//const { cancelAuthentication } = await handler.listenForOsCredentials();
				const authenticationListenHandler = await handler
					.listenForOsCredentials()
					.catch(ErrorHandler.handle.bind(null, OperationType.unknown));

				eventEmitter.emit(EventType.StartFingerprintVerification);
				eventEmitter.once(EventType.StopFingerprintVerification, async () => {
					if (authenticationListenHandler instanceof OsAuthenticationListenHandler) {
						await authenticationListenHandler.cancelAuthentication();
					}
				});
			},
			default: () => {
				return Promise.reject();
			},
		})();
	}

	onValidCredentialsProvided(): void {
		console.log('Valid fingerprint credentials provided.');
	}
}
