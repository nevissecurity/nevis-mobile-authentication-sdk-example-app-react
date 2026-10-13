/**
 * Copyright © 2026 Nevis Security AG. All rights reserved.
 */

import { HttpError } from '@nevis-security/nevis-mobile-authentication-sdk-react';

import { headerAsString } from './ResponseHeadersUtils.ts';

export function httpErrorAsString(error: HttpError): string {
	return `
	HttpError
		Status code: ${error.statusCode}
		Request url: ${error.requestUrl}
		Body: ${error.body}
		Headers:
			${headerAsString(error.headers)}
		Method: ${error.method}
		Underlying: ${error.underlying}
	`;
}
