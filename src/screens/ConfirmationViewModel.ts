/**
 * Copyright © 2024 Nevis Security AG. All rights reserved.
 */

import { useState } from 'react';

import {
	BiometricPromptOptions,
	BiometricUserVerificationHandler,
	FingerprintUserVerificationHandler,
} from '@nevis-security/nevis-mobile-authentication-sdk-react';
import i18next from 'i18next';

import { ErrorHandler } from '../error/ErrorHandler';
import { OperationType } from '../model/OperationType';

const useConfirmationViewModel = () => {
	const [isFingerPrintVerification, setFingerPrintVerification] = useState(false);

	async function confirm(
		handler: BiometricUserVerificationHandler | FingerprintUserVerificationHandler
	) {
		if (handler instanceof BiometricUserVerificationHandler) {
			console.log('Confirming biometric user verification.');
			await handler
				.listenForOsCredentials(
					BiometricPromptOptions.create(
						i18next.t('biometric.popup.title'),
						i18next.t('biometric.popup.cancelButtonTitle'),
						i18next.t('biometric.popup.description')
					)
				)
				.catch(ErrorHandler.handle.bind(null, OperationType.unknown));
		} else {
			console.log('Confirming fingerprint user verification.');
			setFingerPrintVerification(true);
			await handler
				.listenForOsCredentials()
				.catch(ErrorHandler.handle.bind(null, OperationType.unknown));
		}
	}

	async function cancel(
		handler: BiometricUserVerificationHandler | FingerprintUserVerificationHandler
	) {
		console.log('Canceling biometric user verification.');
		await handler.cancel().catch(ErrorHandler.handle.bind(null, OperationType.unknown));
	}

	return {
		isFingerPrintVerification,
		confirm,
		cancel,
	};
};

export default useConfirmationViewModel;
