/**
 * Copyright © 2023 Nevis Security AG. All rights reserved.
 */

import {
	DevicePasscodeUserVerificationContext,
	DevicePasscodeUserVerificationHandler,
	DevicePasscodeUserVerifier,
} from '@nevis-security/nevis-mobile-authentication-sdk-react';

import { localizedAuthenticatorTitle } from '../utility/AuthenticatorUtils';
import * as RootNavigation from '../utility/RootNavigation';

export class DevicePasscodeUserVerifierImpl extends DevicePasscodeUserVerifier {
	async verifyDevicePasscode(
		context: DevicePasscodeUserVerificationContext,
		handler: DevicePasscodeUserVerificationHandler
	): Promise<void> {
		console.log('Please start device passcode user verification.');
		RootNavigation.navigate('Confirmation', {
			authenticator: localizedAuthenticatorTitle(context.authenticator),
			handler: handler,
		});
	}

	onValidCredentialsProvided(): void {
		console.log('Valid device passcode credentials provided.');
	}
}
