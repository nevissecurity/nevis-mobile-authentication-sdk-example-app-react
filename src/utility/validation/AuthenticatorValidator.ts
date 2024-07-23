/**
 * Copyright © 2024 Nevis Security AG. All rights reserved.
 */
import { Platform } from 'react-native';

import {
	Aaid,
	Authenticator,
	AuthenticatorSelectionContext,
} from '@nevis-security/nevis-mobile-authentication-sdk-react';

import AsyncUtils from '../AsyncUtils';
import { AuthenticatorUtils } from '../AuthenticatorUtils';

export abstract class AuthenticatorValidator {
	/**
	 * Validates authenticators for registration.
	 * @param context The context holding the accounts to validate.
	 * @param allowlistedAuthenticators The array holding the allowlisted authenticators.
	 * @returns The array of allowed authenticators.
	 */
	static async validateForRegistration(
		context: AuthenticatorSelectionContext,
		allowlistedAuthenticators: Array<Aaid>
	): Promise<Array<Authenticator>> {
		const allowedAuthenticators: Array<Authenticator> =
			AuthenticatorValidatorImpl.allowedAuthenticators(context, allowlistedAuthenticators);

		return AsyncUtils.asyncFilter(
			allowedAuthenticators,
			async (authenticator: Authenticator) => {
				// Do not display:
				//  - policy non-compliant authenticators (this includes already registered authenticators)
				//  - not hardware supported authenticators
				//  - prefer Biometrics authenticator on Android
				const isSupportedByHardware = authenticator.isSupportedByHardware;
				const isPolicyCompliant = await context.isPolicyCompliant(authenticator.aaid);
				const filterAndroidIfNecessary =
					await AuthenticatorValidatorImpl.filterAndroidFingerprintIfNecessary(
						context,
						authenticator
					);
				return isSupportedByHardware && isPolicyCompliant && filterAndroidIfNecessary;
			}
		);
	}

	/**
	 * Validates authenticators for authentication.
	 * @param context The context holding the accounts to validate.
	 * @param allowlistedAuthenticators The array holding the allowlisted authenticators.
	 * @returns The array of allowed authenticators.
	 */
	static validateForAuthentication(
		context: AuthenticatorSelectionContext,
		allowlistedAuthenticators: Array<Aaid>
	): Array<Authenticator> {
		return AuthenticatorValidatorImpl.allowedAuthenticators(
			context,
			allowlistedAuthenticators
		).filter((authenticator) => {
			// Do not display:
			//   - non-registered authenticators
			//   - not hardware supported authenticators
			return (
				authenticator.isSupportedByHardware &&
				authenticator.registration.isRegistered(context.account.username)
			);
		});
	}
}

export class AuthenticatorValidatorImpl extends AuthenticatorValidator {
	/**
	 * Filters out non-allowlisted authenticators.
	 * @param context The context holding the accounts to validate.
	 * @param allowlistedAuthenticators The array holding the allowlisted authenticators.
	 * @returns The array of allowed authenticators.
	 */
	static allowedAuthenticators(
		context: AuthenticatorSelectionContext,
		allowlistedAuthenticators: Array<Aaid>
	): Array<Authenticator> {
		return context.authenticators.filter((authenticator) => {
			const authenticatorAaid = AuthenticatorUtils.getAaidFromRawValue(authenticator.aaid);
			if (authenticatorAaid === undefined) {
				return false;
			}
			return allowlistedAuthenticators.some((allowlistedAuthenticator) => {
				return allowlistedAuthenticator.rawValue() === authenticatorAaid.rawValue();
			});
		});
	}

	static async filterAndroidFingerprintIfNecessary(
		context: AuthenticatorSelectionContext,
		authenticator: Authenticator
	): Promise<boolean> {
		if (Platform.OS === 'ios' || authenticator.aaid !== Aaid.FINGERPRINT.rawValue()) {
			return true;
		}

		let isBiometricsRegistered: boolean = false;
		let canRegisterBiometrics: boolean = false;
		let canRegisterFingerprint: boolean = false;
		for (const contextAuthenticator of context.authenticators) {
			if (
				contextAuthenticator.aaid === Aaid.BIOMETRIC.rawValue() &&
				contextAuthenticator.registration.isRegistered(context.account.username)
			) {
				isBiometricsRegistered = true;
			}

			if (
				contextAuthenticator.aaid === Aaid.BIOMETRIC.rawValue() &&
				contextAuthenticator.isSupportedByHardware &&
				(await context.isPolicyCompliant(contextAuthenticator.aaid))
			) {
				canRegisterBiometrics = true;
			}

			if (
				contextAuthenticator.aaid === Aaid.FINGERPRINT.rawValue() &&
				contextAuthenticator.isSupportedByHardware &&
				(await context.isPolicyCompliant(contextAuthenticator.aaid))
			) {
				canRegisterFingerprint = true;
			}
		}

		// If biometric can be registered (or is already registered), or if we
		// cannot register fingerprint, do not propose to register fingerprint
		// (we favor biometric over fingerprint).
		return !isBiometricsRegistered && !canRegisterBiometrics && canRegisterFingerprint;
	}
}
