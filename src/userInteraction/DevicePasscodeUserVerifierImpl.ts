/**
 * Copyright © 2023 Nevis Security AG. All rights reserved.
 */

import {
	DevicePasscodePromptOptions,
	DevicePasscodeUserVerificationContext,
	DevicePasscodeUserVerificationHandler,
	DevicePasscodeUserVerifier,
} from '@nevis-security/nevis-mobile-authentication-sdk-react';
import i18next from 'i18next';

import { ErrorHandler } from '../error/ErrorHandler';
import { OperationType } from '../model/OperationType';

export class DevicePasscodeUserVerifierImpl extends DevicePasscodeUserVerifier {
	async verifyDevicePasscode(
		_context: DevicePasscodeUserVerificationContext,
		handler: DevicePasscodeUserVerificationHandler
	): Promise<void> {
		console.log('Please start device passcode user verification.');
		await handler
			.listenForOsCredentials(
				DevicePasscodePromptOptions.create(
					i18next.t('devicePasscode.popup.title'),
					i18next.t('devicePasscode.popup.description')
				)
			)
			.catch(ErrorHandler.handle.bind(null, OperationType.unknown));
	}

	onValidCredentialsProvided(): void {
		console.log('Valid device passcode credentials provided.');
	}
}
