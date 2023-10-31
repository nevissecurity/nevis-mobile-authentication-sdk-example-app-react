/**
 * Copyright © 2023 Nevis Security AG. All rights reserved.
 */

import { useState } from 'react';

import {
	PinChangeHandler,
	PinEnrollmentHandler,
	PinUserVerificationHandler,
} from '@nevis-security/nevis-mobile-authentication-sdk-react';

import { ErrorHandler } from '../error/ErrorHandler';
import { OperationType } from '../model/OperationType';
import { PinMode } from '../model/PinMode';

const usePinViewModel = () => {
	const [oldPin, setOldPin] = useState('');
	const [pin, setPin] = useState('');

	async function confirm(
		mode: PinMode,
		handler?: PinEnrollmentHandler | PinUserVerificationHandler | PinChangeHandler
	) {
		console.log('Confirming entered credentials.');
		switch (mode) {
			case PinMode.enrollment:
				await (handler as PinEnrollmentHandler)
					.pin(pin)
					.catch(ErrorHandler.handle.bind(null, OperationType.registration));
				break;
			case PinMode.verification:
				await (handler as PinUserVerificationHandler)
					.verifyPin(pin)
					.catch(ErrorHandler.handle.bind(null, OperationType.unknown));
				break;
			case PinMode.credentialChange:
				await (handler as PinChangeHandler)
					.pins(oldPin, pin)
					.catch(ErrorHandler.handle.bind(null, OperationType.pinChange));
				break;
		}
	}

	async function cancel(
		mode: PinMode,
		handler?: PinEnrollmentHandler | PinUserVerificationHandler | PinChangeHandler
	) {
		switch (mode) {
			case PinMode.enrollment:
				console.log('Cancelling PIN enrollment.');
				await (handler as PinEnrollmentHandler)
					.cancel()
					.catch(ErrorHandler.handle.bind(null, OperationType.registration));
				break;
			case PinMode.verification:
				console.log('Cancelling PIN verification.');
				await (handler as PinUserVerificationHandler)
					.cancel()
					.catch(ErrorHandler.handle.bind(null, OperationType.unknown));
				break;
			case PinMode.credentialChange:
				console.log('Cancelling PIN change.');
				await (handler as PinChangeHandler)
					.cancel()
					.catch(ErrorHandler.handle.bind(null, OperationType.pinChange));
				break;
		}
	}

	return {
		setOldPin,
		setPin,
		confirm,
		cancel,
	};
};

export default usePinViewModel;
