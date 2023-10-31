/**
 * Copyright © 2023 Nevis Security AG. All rights reserved.
 */

import {
	PinChangeContext,
	PinChangeHandler,
	PinChanger,
} from '@nevis-security/nevis-mobile-authentication-sdk-react';

import { PinMode } from '../model/PinMode';
import * as RootNavigation from '../utility/RootNavigation';

export class PinChangerImpl extends PinChanger {
	changePin(context: PinChangeContext, handler: PinChangeHandler): void {
		console.log(
			context.lastRecoverableError
				? 'PIN change failed. Please try again.'
				: 'Please start PIN change.'
		);

		RootNavigation.navigate('Pin', {
			mode: PinMode.credentialChange,
			handler: handler,
			lastRecoverableError: context.lastRecoverableError,
			authenticatorProtectionStatus: context.authenticatorProtectionStatus,
		});
	}
}
