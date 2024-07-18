/**
 * Copyright © 2023 Nevis Security AG. All rights reserved.
 */

import { Aaid, Authenticator } from '@nevis-security/nevis-mobile-authentication-sdk-react';
import i18next from 'i18next';

export class AuthenticatorItem {
	authenticator: Authenticator;
	isPolicyCompliant: boolean;
	isUserEnrolled: boolean;
	isEnabled: boolean;

	constructor(authenticator: Authenticator, isPolicyCompliant: boolean, isUserEnrolled: boolean) {
		this.authenticator = authenticator;
		this.isPolicyCompliant = isPolicyCompliant;
		this.isUserEnrolled = isUserEnrolled;
		this.isEnabled =
			isPolicyCompliant &&
			(authenticator.aaid === Aaid.PIN.rawValue() ||
				authenticator.aaid === Aaid.PASSWORD.rawValue() ||
				isUserEnrolled);
	}
}

export class AuthenticatorItemUtils {
	static localizedDetails(item: AuthenticatorItem) {
		if (item.isEnabled) {
			return undefined;
		}

		if (!item.isPolicyCompliant) {
			return i18next.t('authenticator.notPolicyCompliant');
		}

		if (!item.isUserEnrolled) {
			return i18next.t('authenticator.notEnrolled');
		}

		return undefined;
	}
}
