/**
 * Copyright © 2024 Nevis Security AG. All rights reserved.
 */

import { useState } from 'react';

import {
	BiometricPromptOptions,
	BiometricUserVerificationHandler,
	DevicePasscodePromptOptions,
	DevicePasscodeUserVerificationHandler,
	FingerprintPromptOptions,
	FingerprintUserVerificationHandler,
} from '@nevis-security/nevis-mobile-authentication-sdk-react';
import i18next from 'i18next';

import { AppErrorUnknownError } from '../error/AppError';
import { ErrorHandler } from '../error/ErrorHandler';
import { OperationType } from '../model/OperationType';

const useConfirmationViewModel = () => {
	const [isFingerPrintVerification, setIsFingerPrintVerification] = useState(false);

	async function confirm(
		handler:
			| BiometricUserVerificationHandler
			| FingerprintUserVerificationHandler
			| DevicePasscodeUserVerificationHandler
	) {
		switch (true) {
			case handler instanceof BiometricUserVerificationHandler:
				console.log('Confirming biometric user verification.');
				await handler
					.listenForOsCredentials(
						BiometricPromptOptions.create(
							i18next.t('biometric.prompt.title'),
							i18next.t('biometric.prompt.cancelButtonText'),
							i18next.t('biometric.prompt.description'),
							i18next.t('biometric.prompt.fallbackButtonText')
						)
					)
					.catch(ErrorHandler.handle.bind(null, OperationType.unknown));
				break;
			case handler instanceof FingerprintUserVerificationHandler:
				console.log('Confirming fingerprint user verification.');
				setIsFingerPrintVerification(true);
				await handler
					.listenForOsCredentials(
						FingerprintPromptOptions.create(
							i18next.t('fingerprint.prompt.cancelButtonText'),
							i18next.t('fingerprint.prompt.description'),
							i18next.t('fingerprint.prompt.fallbackButtonText')
						)
					)
					.catch(ErrorHandler.handle.bind(null, OperationType.unknown));
				break;
			case handler instanceof DevicePasscodeUserVerificationHandler:
				console.log('Confirming device passcode user verification.');
				await handler
					.listenForOsCredentials(
						DevicePasscodePromptOptions.create(
							i18next.t('devicePasscode.prompt.title'),
							i18next.t('devicePasscode.prompt.description')
						)
					)
					.catch(ErrorHandler.handle.bind(null, OperationType.unknown));
				break;
			default:
				ErrorHandler.handle(
					OperationType.unknown,
					new AppErrorUnknownError('Unknown user verification handler.')
				);
		}
	}

	async function cancel(
		handler:
			| BiometricUserVerificationHandler
			| FingerprintUserVerificationHandler
			| DevicePasscodeUserVerificationHandler
	) {
		console.log('Canceling user verification.');
		await handler.cancel().catch(ErrorHandler.handle.bind(null, OperationType.unknown));
	}

	return {
		isFingerPrintVerification,
		confirm,
		cancel,
	};
};

export default useConfirmationViewModel;
