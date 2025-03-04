/**
 * Copyright © 2023 Nevis Security AG. All rights reserved.
 */

import {
	AuthCloudApiFidoError,
	AuthenticationFidoError,
	MobileAuthenticationClientError,
	OperationFidoError,
} from '@nevis-security/nevis-mobile-authentication-sdk-react';

import { AppError } from './AppError';
import { OperationType } from '../model/OperationType';
import * as RootNavigation from '../utility/RootNavigation';

export class ErrorHandler {
	static handle(
		operationType: OperationType,
		error: AppError | MobileAuthenticationClientError | Error
	) {
		let description: string;
		let cause: string | undefined;

		// As this is an example app, we are directly showing the technical error occurring.
		// Be aware that this is not to be considered best practice. Your own production app
		// should handle the errors in a more appropriate manner  such as providing translations
		// for all your supported languages as well as simplifying the error message presented
		// to the end-user in a way non-technical adverse people can understand and act upon them.
		if (
			error instanceof OperationFidoError ||
			error instanceof AuthCloudApiFidoError ||
			error instanceof AuthenticationFidoError
		) {
			description = error.errorCode.description;
			cause = error.cause;
		} else if (error instanceof AppError || error instanceof MobileAuthenticationClientError) {
			description = error.description;
			cause = error.cause;
		} else {
			description = error.message;
		}
		RootNavigation.navigate('Result', {
			operation: operationType,
			errorDescription: description,
			errorCause: cause,
		});
	}
}
