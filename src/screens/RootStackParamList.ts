/**
 * Copyright © 2023 Nevis Security AG. All rights reserved.
 */

import {
	AccountSelectionHandler,
	AuthenticatorSelectionHandler,
	BiometricUserVerificationHandler,
	DevicePasscodeUserVerificationHandler,
	FingerprintUserVerificationHandler,
	PasswordAuthenticatorProtectionStatus,
	PasswordChangeHandler,
	PasswordEnrollmentHandler,
	PasswordUserVerificationHandler,
	PinAuthenticatorProtectionStatus,
	PinChangeHandler,
	PinEnrollmentHandler,
	PinUserVerificationHandler,
	RecoverableError,
} from '@nevis-security/nevis-mobile-authentication-sdk-react';

import type { AccountItem } from '../model/AccountItem';
import type { AuthenticatorItem } from '../model/AuthenticatorItem';
import type { OperationType } from '../model/OperationType';
import { PasswordMode } from '../model/PasswordMode';
import type { PinMode } from '../model/PinMode';

export type RootStackParamList = {
	Home: undefined;
	ReadQrCode: undefined;
	AuthCloudApiRegistration: undefined;
	SelectAccount: {
		items: Array<AccountItem>;
		operation: OperationType;
		handler?: AccountSelectionHandler;
		transactionConfirmationData?: string;
	};
	SelectAuthenticator: {
		items: Array<AuthenticatorItem>;
		handler?: AuthenticatorSelectionHandler;
	};
	Pin: {
		mode: PinMode;
		handler?: PinEnrollmentHandler | PinUserVerificationHandler | PinChangeHandler;
		lastRecoverableError?: RecoverableError;
		authenticatorProtectionStatus?: PinAuthenticatorProtectionStatus;
	};
	Password: {
		mode: PasswordMode;
		handler?:
			| PasswordEnrollmentHandler
			| PasswordUserVerificationHandler
			| PasswordChangeHandler;
		lastRecoverableError?: RecoverableError;
		authenticatorProtectionStatus?: PasswordAuthenticatorProtectionStatus;
	};
	DeviceInformationChange: {
		name: string;
	};
	TransactionConfirmation: {
		transactionConfirmationData: string;
		selectedUsername: string;
		accountSelectionHandler?: AccountSelectionHandler;
	};
	UsernamePasswordLogin: undefined;
	Confirmation: {
		authenticator: string;
		handler:
			| BiometricUserVerificationHandler
			| FingerprintUserVerificationHandler
			| DevicePasscodeUserVerificationHandler;
	};
	Result: {
		operation: OperationType;
		errorDescription?: string;
		errorCause?: string;
	};
};
