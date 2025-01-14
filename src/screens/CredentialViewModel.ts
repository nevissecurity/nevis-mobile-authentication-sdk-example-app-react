/**
 * Copyright © 2025 Nevis Security AG. All rights reserved.
 */

import { useState } from 'react';

import {
	PasswordChangeHandler,
	PasswordEnrollmentHandler,
	PasswordUserVerificationHandler,
	PinChangeHandler,
	PinEnrollmentHandler,
	PinUserVerificationHandler,
} from '@nevis-security/nevis-mobile-authentication-sdk-react';

import { ErrorHandler } from '../error/ErrorHandler';
import { CredentialKind } from '../model/CredentialKind';
import { CredentialMode } from '../model/CredentialMode';
import { OperationType } from '../model/OperationType';

const useCredentialViewModel = () => {
	const [oldCredential, setOldCredential] = useState('');
	const [credential, setCredential] = useState('');

	async function confirm(
		mode: CredentialMode,
		kind: CredentialKind,
		handler?:
			| PinEnrollmentHandler
			| PinUserVerificationHandler
			| PinChangeHandler
			| PasswordEnrollmentHandler
			| PasswordUserVerificationHandler
			| PasswordChangeHandler
	) {
		console.log('Confirming entered credentials.');
		switch (mode) {
			case CredentialMode.enrollment:
				switch (kind) {
					case CredentialKind.pin:
						await (handler as PinEnrollmentHandler)
							.pin(credential)
							.catch(ErrorHandler.handle.bind(null, OperationType.registration));
						break;
					case CredentialKind.password:
						await (handler as PasswordEnrollmentHandler)
							.password(credential)
							.catch(ErrorHandler.handle.bind(null, OperationType.registration));
						break;
				}
				break;
			case CredentialMode.verification:
				switch (kind) {
					case CredentialKind.pin:
						await (handler as PinUserVerificationHandler)
							.verifyPin(credential)
							.catch(ErrorHandler.handle.bind(null, OperationType.unknown));
						break;
					case CredentialKind.password:
						await (handler as PasswordUserVerificationHandler)
							.verifyPassword(credential)
							.catch(ErrorHandler.handle.bind(null, OperationType.unknown));
						break;
				}
				break;
			case CredentialMode.change:
				switch (kind) {
					case CredentialKind.pin:
						await (handler as PinChangeHandler)
							.pins(oldCredential, credential)
							.catch(ErrorHandler.handle.bind(null, OperationType.pinChange));
						break;
					case CredentialKind.password:
						await (handler as PasswordChangeHandler)
							.passwords(oldCredential, credential)
							.catch(ErrorHandler.handle.bind(null, OperationType.passwordChange));
						break;
				}
		}
	}

	async function cancel(
		mode: CredentialMode,
		kind: CredentialKind,
		handler?:
			| PinEnrollmentHandler
			| PinUserVerificationHandler
			| PinChangeHandler
			| PasswordEnrollmentHandler
			| PasswordUserVerificationHandler
			| PasswordChangeHandler
	) {
		switch (mode) {
			case CredentialMode.enrollment:
				switch (kind) {
					case CredentialKind.pin:
						console.log('Cancelling PIN enrollment.');
						await (handler as PinEnrollmentHandler)
							.cancel()
							.catch(ErrorHandler.handle.bind(null, OperationType.registration));
						break;
					case CredentialKind.password:
						console.log('Cancelling password enrollment.');
						await (handler as PasswordEnrollmentHandler)
							.cancel()
							.catch(ErrorHandler.handle.bind(null, OperationType.registration));
						break;
				}
				break;
			case CredentialMode.verification:
				switch (kind) {
					case CredentialKind.pin:
						console.log('Cancelling PIN verification.');
						await (handler as PinUserVerificationHandler)
							.cancel()
							.catch(ErrorHandler.handle.bind(null, OperationType.unknown));
						break;
					case CredentialKind.password:
						console.log('Cancelling password verification.');
						await (handler as PasswordUserVerificationHandler)
							.cancel()
							.catch(ErrorHandler.handle.bind(null, OperationType.unknown));
						break;
				}
				break;
			case CredentialMode.change:
				switch (kind) {
					case CredentialKind.pin:
						console.log('Cancelling PIN change.');
						await (handler as PinChangeHandler)
							.cancel()
							.catch(ErrorHandler.handle.bind(null, OperationType.pinChange));
						break;
					case CredentialKind.password:
						console.log('Cancelling password change.');
						await (handler as PasswordChangeHandler)
							.cancel()
							.catch(ErrorHandler.handle.bind(null, OperationType.passwordChange));
						break;
				}
				break;
		}
	}

	return {
		setOldCredential,
		setCredential,
		confirm,
		cancel,
	};
};

export default useCredentialViewModel;
