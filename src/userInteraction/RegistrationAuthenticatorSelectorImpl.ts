/**
 * Copyright © 2023 Nevis Security AG. All rights reserved.
 */

import { Platform } from 'react-native';

import {
	Aaid,
	Authenticator,
	AuthenticatorSelectionContext,
	AuthenticatorSelectionHandler,
	AuthenticatorSelector,
} from '@nevis-security/nevis-mobile-authentication-sdk-react';

import { AuthenticatorItem } from '../model/AuthenticatorItem';
import * as RootNavigation from '../utility/RootNavigation';

export class RegistrationAuthenticatorSelectorImpl extends AuthenticatorSelector {
	constructor() {
		super();
	}

	async selectAuthenticator(
		context: AuthenticatorSelectionContext,
		handler: AuthenticatorSelectionHandler
	): Promise<void> {
		console.log('Please select one of the received available authenticators!');
		const authenticators: Authenticator[] = [];
		for (const authenticator of context.authenticators) {
			const mustDisplay = await this.mustDisplayForRegistration(authenticator, context);
			if (mustDisplay) {
				authenticators.push(authenticator);
			}
		}

		const items: AuthenticatorItem[] = [];
		for (const authenticator of authenticators) {
			items.push(
				new AuthenticatorItem(
					authenticator,
					await context.isPolicyCompliant(authenticator.aaid),
					authenticator.userEnrollment.isEnrolled(context.account.username)
				)
			);
		}

		RootNavigation.navigate('SelectAuthenticator', { items: items, handler: handler });
	}

	async mustDisplayForRegistration(
		authenticator: Authenticator,
		context: AuthenticatorSelectionContext
	): Promise<boolean> {
		if (Platform.OS === 'android') {
			const biometricsRegistered = context.authenticators.filter((contextAuthenticator) => {
				return (
					contextAuthenticator.aaid === Aaid.BIOMETRIC.rawValue() &&
					contextAuthenticator.registration.isRegistered(context.account.username)
				);
			});

			const biometricsAvailable: Authenticator[] = [];
			const fingerprintAvailable: Authenticator[] = [];
			for (const contextAuthenticator of context.authenticators) {
				const isBiometricAvailable =
					contextAuthenticator.aaid === Aaid.BIOMETRIC.rawValue() &&
					contextAuthenticator.isSupportedByHardware &&
					(await context.isPolicyCompliant(contextAuthenticator.aaid));
				if (isBiometricAvailable) {
					biometricsAvailable.push(contextAuthenticator);
				}

				const isFingerprintAvailable =
					contextAuthenticator.aaid === Aaid.FINGERPRINT.rawValue() &&
					contextAuthenticator.isSupportedByHardware &&
					(await context.isPolicyCompliant(contextAuthenticator.aaid));
				if (isFingerprintAvailable) {
					fingerprintAvailable.push(contextAuthenticator);
				}
			}

			// If biometric can be registered (or is already registered), or if we
			// cannot register fingerprint, do not propose to register fingerprint
			// (we favor biometric over fingerprint).
			if (
				(biometricsRegistered.length > 0 ||
					biometricsAvailable.length > 0 ||
					fingerprintAvailable.length === 0) &&
				authenticator.aaid === Aaid.FINGERPRINT.rawValue()
			) {
				console.log(`Return false`);
				return false;
			}
		}

		// Do not display:
		//  - policy non-compliant authenticators (this includes already registered authenticators)
		//  - not hardware supported authenticators
		const isPolicyCompliant = await context.isPolicyCompliant(authenticator.aaid);
		return authenticator.isSupportedByHardware && isPolicyCompliant;
	}
}
