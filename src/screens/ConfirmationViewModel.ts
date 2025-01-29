/**
 * Copyright © 2024 Nevis Security AG. All rights reserved.
 */

import { useState } from 'react';

import {
	BiometricPromptOptions,
	BiometricUserVerificationHandler,
	DevicePasscodePromptOptions,
	DevicePasscodeUserVerificationHandler,
	FingerprintUserVerificationHandler,
	OsAuthenticationListenHandler,
} from '@nevis-security/nevis-mobile-authentication-sdk-react';
import i18next from 'i18next';

import { AppErrorUnknownError } from '../error/AppError';
import { ErrorHandler } from '../error/ErrorHandler';
import { OperationType } from '../model/OperationType';

const useConfirmationViewModel = () => {
	const [isFingerPrintVerification, setIsFingerPrintVerification] = useState(false);
	const [listenHandler, setListenHandler] = useState<OsAuthenticationListenHandler>();

	async function onPause() {
		if (listenHandler !== undefined) {
			console.log('OS authentication listen handler exists, pausing...');
			await listenHandler
				.pauseListening()
				.then((newListenHandler) => {
					setListenHandler(newListenHandler);
					console.log('Listening paused.');
				})
				.catch(ErrorHandler.handle.bind(null, OperationType.unknown));
		}
	}

	async function onResume() {
		if (listenHandler !== undefined) {
			console.log('OS authentication listen handler exists, resuming...');
			await listenHandler
				.resumeListening()
				.then((newListenHandler) => {
					setListenHandler(newListenHandler);
					console.log('Listening resumed.');
				})
				.catch(ErrorHandler.handle.bind(null, OperationType.unknown));
		}
	}

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
							i18next.t('biometric.popup.title'),
							i18next.t('biometric.popup.cancelButtonTitle'),
							i18next.t('biometric.popup.description')
						)
					)
					.then((listenHandler) => {
						setListenHandler(listenHandler);
					})
					.catch(ErrorHandler.handle.bind(null, OperationType.unknown));
				break;
			case handler instanceof FingerprintUserVerificationHandler:
				console.log('Confirming fingerprint user verification.');
				setIsFingerPrintVerification(true);
				await handler
					.listenForOsCredentials()
					.then((listenHandler) => {
						setListenHandler(listenHandler);
					})
					.catch(ErrorHandler.handle.bind(null, OperationType.unknown));
				break;
			case handler instanceof DevicePasscodeUserVerificationHandler:
				console.log('Confirming device passcode user verification.');
				await handler
					.listenForOsCredentials(
						DevicePasscodePromptOptions.create(
							i18next.t('devicePasscode.popup.title'),
							i18next.t('devicePasscode.popup.description')
						)
					)
					.then((listenHandler) => {
						setListenHandler(listenHandler);
					})
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
		onPause,
		onResume,
		confirm,
		cancel,
	};
};

export default useConfirmationViewModel;
