/**
 * Copyright © 2023 Nevis Security AG. All rights reserved.
 */

import i18next from 'i18next';

export abstract class AppError extends Error {
	abstract description: string;
	abstract cause?: string;
}
export class AppErrorLoadAppConfigurationError extends AppError {
	description = i18next.t('appError.loadAppConfigurationError');
	cause?: string;
	constructor(cause?: string) {
		super();
		this.cause = cause;
	}
}

export class AppErrorReadLoginConfigurationError extends AppError {
	description: string = i18next.t('appError.readLoginConfigurationError');
	cause?: string;

	constructor(cause?: string) {
		super();
		this.cause = cause;
	}
}

export class AppErrorCookieNotFound extends AppError {
	description: string = i18next.t('appError.cookieNotFound');
	cause?: string;

	constructor(cause?: string) {
		super();
		this.cause = cause;
	}
}

export class AppErrorAuthorizationProviderNotFound extends AppError {
	description: string = i18next.t('appError.authorizationProviderNotFound');
	cause?: string;

	constructor(cause?: string) {
		super();
		this.cause = cause;
	}
}

export class AppErrorAccountsNotFound extends AppError {
	description: string = i18next.t('appError.accountsNotFound');
	cause?: string;

	constructor(cause?: string) {
		super();
		this.cause = cause;
	}
}

export class AppErrorAuthenticatorNotFound extends AppError {
	description: string = i18next.t('appError.authenticatorNotFound');
	cause?: string;

	constructor(cause?: string) {
		super();
		this.cause = cause;
	}
}

export class AppErrorPinAuthenticatorNotFound extends AppError {
	description: string = i18next.t('appError.pinAuthenticatorNotFound');
	cause?: string;

	constructor(cause?: string) {
		super();
		this.cause = cause;
	}
}

export class AppErrorPasswordAuthenticatorNotFound extends AppError {
	description: string = i18next.t('appError.passwordAuthenticatorNotFound');
	cause?: string;

	constructor(cause?: string) {
		super();
		this.cause = cause;
	}
}

export class AppErrorDeviceInformationNotFound extends AppError {
	description: string = i18next.t('appError.deviceInformationNotFound');
	cause?: string;

	constructor(cause?: string) {
		super();
		this.cause = cause;
	}
}

export class AppErrorLoginDataNotFound extends AppError {
	description: string = i18next.t('appError.loginDataNotFound');
	cause?: string;

	constructor(cause?: string) {
		super();
		this.cause = cause;
	}
}

export class AppErrorLoginError extends AppError {
	description: string = i18next.t('appError.loginError');
	cause?: string;

	constructor(cause?: string) {
		super();
		this.cause = cause;
	}
}

export class AppErrorPayloadDecodeError extends AppError {
	description: string = i18next.t('appError.payloadDecodeError');
	cause?: string;

	constructor(cause?: string) {
		super();
		this.cause = cause;
	}
}

export class AppErrorPermissionError extends AppError {
	description = i18next.t('appError.permissionError');
	cause?: string;
	constructor(cause?: string) {
		super();
		this.cause = cause;
	}
}

export class AppErrorQrCodeError extends AppError {
	description = i18next.t('appError.qrCoreError');
	cause?: string;
	constructor(cause?: string) {
		super();
		this.cause = cause;
	}
}

export class AppErrorUnknownError extends AppError {
	description;
	cause?: string;
	constructor(description: string, cause?: string) {
		super();
		this.description = description;
		this.cause = cause;
	}
}
