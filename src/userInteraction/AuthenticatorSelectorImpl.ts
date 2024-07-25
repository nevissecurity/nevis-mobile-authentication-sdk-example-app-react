/**
 * Copyright © 2023 Nevis Security AG. All rights reserved.
 */

import {
	Authenticator,
	AuthenticatorSelectionContext,
	AuthenticatorSelectionHandler,
	AuthenticatorSelector,
} from '@nevis-security/nevis-mobile-authentication-sdk-react';

import { ConfigurationLoader } from '../configuration/ConfigurationLoader';
import { AuthenticatorItem } from '../model/AuthenticatorItem';
import * as RootNavigation from '../utility/RootNavigation';
import { AuthenticatorValidator } from '../utility/validation/AuthenticatorValidator';

export enum AuthenticatorSelectorOperation {
	registration,
	authentication,
}

export class AuthenticatorSelectorImpl extends AuthenticatorSelector {
	operation: AuthenticatorSelectorOperation;
	constructor(operation: AuthenticatorSelectorOperation) {
		super();
		this.operation = operation;
	}

	async selectAuthenticator(
		context: AuthenticatorSelectionContext,
		handler: AuthenticatorSelectionHandler
	): Promise<void> {
		console.log('Please select one of the received available authenticators!');
		const configuration = ConfigurationLoader.getInstance().appConfiguration;
		const username = context.account.username;
		let authenticators: Array<Authenticator> = [];
		switch (this.operation) {
			case AuthenticatorSelectorOperation.registration:
				authenticators = await AuthenticatorValidator.validateForRegistration(
					context,
					configuration.authenticatorAllowlist
				);
				break;
			case AuthenticatorSelectorOperation.authentication:
				authenticators = AuthenticatorValidator.validateForAuthentication(
					context,
					configuration.authenticatorAllowlist
				);
				break;
		}

		if (authenticators.length === 0) {
			console.log('No available authenticators found. Cancelling authenticator selection.');
			return handler.cancel();
		}

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
