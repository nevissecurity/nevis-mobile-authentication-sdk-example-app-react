/**
 * Copyright © 2024 Nevis Security AG. All rights reserved.
 */

import {
	PasswordChangeRecoverableCustomValidationError,
	PasswordEnrollmentCustomValidationError,
	PasswordPolicy,
} from '@nevis-security/nevis-mobile-authentication-sdk-react';

export class PasswordPolicyImpl extends PasswordPolicy {
	errorMessage = 'The password must not be password.';
	cause = 'The password is password';

	validatePasswordForEnrollment(
		password: string,
		onSuccess: () => void,
		onError: (error: PasswordEnrollmentCustomValidationError) => void
	): void {
		console.log(`Received password for enrollment is ${password}`);

		this._isValid(password)
			? onSuccess()
			: onError(new PasswordEnrollmentCustomValidationError(this.errorMessage, this.cause));
	}
	validatePasswordForPasswordChange(
		password: string,
		onSuccess: () => void,
		onError: (error: PasswordChangeRecoverableCustomValidationError) => void
	): void {
		console.log(`Received password for change is ${password}`);

		this._isValid(password)
			? onSuccess()
			: onError(
					new PasswordChangeRecoverableCustomValidationError(
						this.errorMessage,
						this.cause
					)
				);
	}

	_isValid(password: string): boolean {
		return password.trim() !== 'password';
	}
}
