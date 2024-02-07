/**
 * Copyright © 2023 Nevis Security AG. All rights reserved.
 */

import {
	PinEnroller,
	PinEnrollmentContext,
	PinEnrollmentHandler,
} from '@nevis-security/nevis-mobile-authentication-sdk-react';

import { PinMode } from '../model/PinMode';
import * as RootNavigation from '../utility/RootNavigation';

export class PinEnrollerImpl extends PinEnroller {
	enrollPin(context: PinEnrollmentContext, handler: PinEnrollmentHandler): void {
		console.log(
			context.lastRecoverableError
				? 'PIN enrollment failed. Please try again.'
				: 'Please start PIN enrollment.'
		);

		RootNavigation.navigate('Pin', {
			mode: PinMode.enrollment,
			handler: handler,
			lastRecoverableError: context.lastRecoverableError,
		});
	}

	onValidCredentialsProvided(): void {
		console.log('Valid PIN credentials provided.');
	}

	// You can add a custom PIN policy by overriding the `pinPolicy` getter.
	// The default minimum and maximum PIN length are 6 without any validation during PIN enrollment or change.
	// pinPolicy = new CustomPinPolicy();
}
