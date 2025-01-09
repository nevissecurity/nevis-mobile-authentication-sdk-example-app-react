/**
 * Copyright © 2023 Nevis Security AG. All rights reserved.
 */

import {
	PinChangeContext,
	PinChangeHandler,
	PinChanger,
} from '@nevis-security/nevis-mobile-authentication-sdk-react';

import { CredentialKind } from '../model/CredentialKind';
import { CredentialMode } from '../model/CredentialMode';
import * as RootNavigation from '../utility/RootNavigation';

export class PinChangerImpl extends PinChanger {
	changePin(context: PinChangeContext, handler: PinChangeHandler): void {
		console.log(
			context.lastRecoverableError
				? 'PIN change failed. Please try again.'
				: 'Please start PIN change.'
		);

		RootNavigation.navigate('Credential', {
			mode: CredentialMode.change,
			kind: CredentialKind.pin,
			handler: handler,
			lastRecoverableError: context.lastRecoverableError,
			pinProtectionStatus: context.authenticatorProtectionStatus,
		});
	}

	// You can add a custom PIN policy by overriding the `pinPolicy` getter.
	// The default minimum and maximum PIN length are 6 without any validation during PIN enrollment or change.
	// pinPolicy = new CustomPinPolicy();
}
