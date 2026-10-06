/**
 * Copyright © 2026 Nevis Security AG. All rights reserved.
 */

import {
	FidoErrorCode,
	HttpError,
	MobileAuthenticationClientError,
	Server,
} from '@nevis-security/nevis-mobile-authentication-sdk-react';

function hasErrorCode(
	error: MobileAuthenticationClientError
): error is MobileAuthenticationClientError & { errorCode: FidoErrorCode } {
	return 'errorCode' in error;
}

export function errorCode(error: MobileAuthenticationClientError): FidoErrorCode | undefined {
	return hasErrorCode(error) ? error.errorCode : undefined;
}

function hasHttpError(
	error: MobileAuthenticationClientError
): error is MobileAuthenticationClientError & { httpError: HttpError } {
	return 'httpError' in error;
}

export function httpError(error: MobileAuthenticationClientError): HttpError | undefined {
	return hasHttpError(error) ? error.httpError : undefined;
}

function hasServer(
	error: MobileAuthenticationClientError
): error is MobileAuthenticationClientError & { server: Server } {
	return 'server' in error;
}

export function server(error: MobileAuthenticationClientError): Server | undefined {
	return hasServer(error) ? error.server : undefined;
}
