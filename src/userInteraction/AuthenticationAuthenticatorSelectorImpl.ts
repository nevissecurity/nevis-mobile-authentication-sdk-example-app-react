/**
 * Copyright © 2023 Nevis Security AG. All rights reserved.
 */

import {
	AuthenticatorSelectionContext,
	AuthenticatorSelectionHandler,
	AuthenticatorSelector,
} from '@nevis-security/nevis-mobile-authentication-sdk-react';

import { AuthenticatorItem } from '../model/AuthenticatorItem';
import * as RootNavigation from '../utility/RootNavigation';

export class AuthenticationAuthenticatorSelectorImpl extends AuthenticatorSelector {
	constructor() {
		super();
	}

	async selectAuthenticator(
		context: AuthenticatorSelectionContext,
		handler: AuthenticatorSelectionHandler
	): Promise<void> {
		console.log('Please select one of the received available authenticators!');
		const username = context.account.username;
		const authenticators = context.authenticators.filter((a) => {
			// Do not display:
			//   - non-registered authenticators
			//   - not hardware supported authenticators
			return a.registration.isRegistered(username) && a.isSupportedByHardware;
		});

		const items: AuthenticatorItem[] = [];
		for (const authenticator of authenticators) {
			items.push(
				new AuthenticatorItem(
					authenticator,
					await context.isPolicyCompliant(authenticator.aaid),
					authenticator.userEnrollment.isEnrolled(username)
				)
			);
		}

		RootNavigation.navigate('SelectAuthenticator', { items: items, handler: handler });
	}
}
