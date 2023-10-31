/**
 * Copyright © 2023 Nevis Security AG. All rights reserved.
 */

import {
	BiometricPromptOptions,
	BiometricUserVerificationContext,
	BiometricUserVerificationHandler,
	BiometricUserVerifier,
} from '@nevis-security/nevis-mobile-authentication-sdk-react';
import i18next from 'i18next';

import { ErrorHandler } from '../error/ErrorHandler';
import { OperationType } from '../model/OperationType';

export class BiometricUserVerifierImpl extends BiometricUserVerifier {
	async verifyBiometric(
		_context: BiometricUserVerificationContext,
		handler: BiometricUserVerificationHandler
	): Promise<void> {
		console.log('Please start biometric user verification.');
		await handler
			.listenForOsCredentials(
				BiometricPromptOptions.create(
					i18next.t('biometric.popup.title'),
					i18next.t('biometric.popup.cancelButtonTitle'),
					i18next.t('biometric.popup.description')
				)
			)
			.catch(ErrorHandler.handle.bind(null, OperationType.unknown));
	}

	onValidCredentialsProvided(): void {
		console.log('Valid biometric credentials provided.');
	}
}
