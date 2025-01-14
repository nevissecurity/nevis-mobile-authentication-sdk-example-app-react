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
import { CredentialKind } from '../model/CredentialKind';
import { CredentialMode } from '../model/CredentialMode';
import type { OperationType } from '../model/OperationType';

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
	Credential: {
		mode: CredentialMode;
		kind: CredentialKind;
		handler?:
			| PinEnrollmentHandler
			| PinUserVerificationHandler
			| PinChangeHandler
			| PasswordEnrollmentHandler
			| PasswordUserVerificationHandler
			| PasswordChangeHandler;
		pinProtectionStatus?: PinAuthenticatorProtectionStatus;
		passwordProtectionStatus?: PasswordAuthenticatorProtectionStatus;
		lastRecoverableError?: RecoverableError;
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
