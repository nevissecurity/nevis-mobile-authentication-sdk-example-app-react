/**
 * Copyright © 2023 Nevis Security AG. All rights reserved.
 */

import { MobileAuthenticationClientError } from '@nevis-security/nevis-mobile-authentication-sdk-react';

import { AppError } from './AppError';
import { OperationType } from '../model/OperationType';
import { httpErrorAsString } from '../utility/HttpErrorUtils.ts';
import { errorCode, httpError, server } from '../utility/MobileAuthenticationClientErrorUtils.ts';
import * as RootNavigation from '../utility/RootNavigation';

export class ErrorHandler {
	static handle(
		operationType: OperationType,
		error: AppError | MobileAuthenticationClientError | Error
	) {
		console.debug('Handling error for operation type:', operationType, 'Error:', error);

		// As this is an example app, we are directly showing the technical error occurring.
		// Be aware that this is not to be considered best practice. Your own production app
		// should handle the errors in a more appropriate manner  such as providing translations
		// for all your supported languages as well as simplifying the error message presented
		// to the end-user in a way non-technical adverse people can understand and act upon them.
		if (error instanceof MobileAuthenticationClientError) {
			let description = error.description;
			const fidoErrorCode = errorCode(error);
			if (fidoErrorCode !== undefined) {
				description = fidoErrorCode.description;
			}

			const underlyingHttpError = httpError(error);
			if (underlyingHttpError !== undefined) {
				console.debug(httpErrorAsString(underlyingHttpError));
			}

			const originServer = server(error);
			if (originServer !== undefined) {
				console.debug(`The error occurred on server with base url ${originServer.baseUrl}`);
			}

			ErrorHandler.navigateToResult(operationType, description, error.cause);
		} else if (error instanceof AppError) {
			ErrorHandler.navigateToResult(operationType, error.description, error.cause);
		} else {
			ErrorHandler.navigateToResult(operationType, error.message, undefined);
		}
	}

	private static navigateToResult(
		operationType: OperationType,
		description: string,
		cause: string | undefined
	) {
		RootNavigation.navigate('Result', {
			operation: operationType,
			errorDescription: description,
			errorCause: cause,
		});
	}
}
