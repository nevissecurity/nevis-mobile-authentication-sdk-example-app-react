/**
 * Copyright © 2024 Nevis Security AG. All rights reserved.
 */

import { useState } from 'react';

import {
	PasswordChangeHandler,
	PasswordEnrollmentHandler,
	PasswordUserVerificationHandler,
} from '@nevis-security/nevis-mobile-authentication-sdk-react';

import { ErrorHandler } from '../error/ErrorHandler';
import { OperationType } from '../model/OperationType';
import { PasswordMode } from '../model/PasswordMode';

const usePasswordViewModel = () => {
	const [oldPassword, setOldPassword] = useState('');
	const [password, setPassword] = useState('');

	async function confirm(
		mode: PasswordMode,
		handler?:
			| PasswordEnrollmentHandler
			| PasswordUserVerificationHandler
			| PasswordChangeHandler
	) {
		console.log('Confirming entered credentials.');
		switch (mode) {
			case PasswordMode.enrollment:
				await (handler as PasswordEnrollmentHandler)
					.password(password)
					.catch(ErrorHandler.handle.bind(null, OperationType.registration));
				break;
			case PasswordMode.verification:
				await (handler as PasswordUserVerificationHandler)
					.verifyPassword(password)
					.catch(ErrorHandler.handle.bind(null, OperationType.unknown));
				break;
			case PasswordMode.credentialChange:
				await (handler as PasswordChangeHandler)
					.passwords(oldPassword, password)
					.catch(ErrorHandler.handle.bind(null, OperationType.passwordChange));
				break;
		}
	}

	async function cancel(
		mode: PasswordMode,
		handler?:
			| PasswordEnrollmentHandler
			| PasswordUserVerificationHandler
			| PasswordChangeHandler
	) {
		switch (mode) {
			case PasswordMode.enrollment:
				console.log('Cancelling password enrollment.');
				await (handler as PasswordEnrollmentHandler)
					.cancel()
					.catch(ErrorHandler.handle.bind(null, OperationType.registration));
				break;
			case PasswordMode.verification:
				console.log('Cancelling password verification.');
				await (handler as PasswordUserVerificationHandler)
					.cancel()
					.catch(ErrorHandler.handle.bind(null, OperationType.unknown));
				break;
			case PasswordMode.credentialChange:
				console.log('Cancelling password change.');
				await (handler as PasswordChangeHandler)
					.cancel()
					.catch(ErrorHandler.handle.bind(null, OperationType.passwordChange));
				break;
		}
	}

	return {
		setOldPassword,
		setPassword,
		confirm,
		cancel,
	};
};

export default usePasswordViewModel;
