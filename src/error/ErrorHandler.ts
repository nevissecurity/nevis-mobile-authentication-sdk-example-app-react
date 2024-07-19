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
	private constructor() {}

	static handle(
		operationType: OperationType,
		error: AppError | MobileAuthenticationClientError | Error
	) {
		let description: string;
		let cause: string | undefined;
		if (
			error instanceof OperationFidoError ||
			error instanceof AuthCloudApiFidoError ||
			error instanceof AuthenticationFidoError
		) {
			description = error.errorCode.description;
			cause = error.cause;
		} else if (error instanceof AppError || error instanceof MobileAuthenticationClientError) {
			description = error.description;
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
