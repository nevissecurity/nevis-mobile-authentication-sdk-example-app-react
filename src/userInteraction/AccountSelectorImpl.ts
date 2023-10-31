/**
 * Copyright © 2023 Nevis Security AG. All rights reserved.
 */

import {
	AccountSelectionContext,
	AccountSelectionHandler,
	AccountSelector,
} from '@nevis-security/nevis-mobile-authentication-sdk-react';

import { AppErrorAuthenticatorNotFound } from '../error/AppError';
import { ErrorHandler } from '../error/ErrorHandler';
import { AccountItem } from '../model/AccountItem';
import { OperationType } from '../model/OperationType';
import * as RootNavigation from '../utility/RootNavigation';

export class AccountSelectorImpl extends AccountSelector {
	async selectAccount(
		context: AccountSelectionContext,
		handler: AccountSelectionHandler
	): Promise<void> {
		console.log('Please select one of the received available accounts!');
		const supportedAuthenticators = context.authenticators.filter(
			(a) => a.isSupportedByHardware
		);
		if (supportedAuthenticators.length === 0) {
			return ErrorHandler.handle(OperationType.unknown, new AppErrorAuthenticatorNotFound());
		}

		const usernames = new Set<string>();
		for (const authenticator of supportedAuthenticators) {
			for (const account of authenticator.registration.registeredAccounts) {
				const isPolicyCompliant = await context.isPolicyCompliant(
					authenticator.aaid,
					account.username
				);
				if (isPolicyCompliant) {
					usernames.add(account.username);
				}
			}
		}

		switch (usernames.size) {
			case 0:
				// No username is compliant with the policy.
				// Provide a random username that will generate an error in the SDK.
				console.log('No valid account found!');
				await handler.username('');
				break;
			case 1:
				{
					const username = usernames.values().next().value;
					if (context.transactionConfirmationData) {
						console.log('Transaction need to be confirmed!');
						RootNavigation.navigate('TransactionConfirmation', {
							transactionConfirmationData: context.transactionConfirmationData,
							selectedUsername: username,
							accountSelectionHandler: handler,
						});
					} else {
						// Typical case: authentication with username provided, just use it.
						console.log('One account found, performing automatic selection!');
						await handler.username(username);
					}
				}
				break;
			default: {
				console.log('Multiple accounts found!');
				const items = Array.from(usernames).map((username) => new AccountItem(username));
				RootNavigation.navigate('SelectAccount', {
					items: items,
					operation: OperationType.unknown,
					handler: handler,
					transactionConfirmationData: context.transactionConfirmationData,
				});
			}
		}
	}
}
