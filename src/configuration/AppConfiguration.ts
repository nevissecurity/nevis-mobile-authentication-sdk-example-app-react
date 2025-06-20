/**
 * Copyright © 2023 Nevis Security AG. All rights reserved.
 */

import { Aaid } from '@nevis-security/nevis-mobile-authentication-sdk-react';

import { AuthenticatorUtils } from '../utility/AuthenticatorUtils';

export class SdkConfiguration {
	hostname: string;

	private constructor(hostname: string) {
		this.hostname = hostname;
	}

	static fromJson(json: any): SdkConfiguration {
		return new SdkConfiguration(json.hostname);
	}
}
export class AppConfiguration {
	sdk: SdkConfiguration;
	loginRequestURL?: string;
	authenticatorAllowlist: Array<Aaid>;

	private constructor(
		sdk: SdkConfiguration,
		authenticatorAllowList: Array<Aaid>,
		loginRequestURL?: string
	) {
		this.sdk = sdk;
		this.authenticatorAllowlist = authenticatorAllowList;
		this.loginRequestURL = loginRequestURL;
	}

	static fromJson(json: any): AppConfiguration {
		const sdk = SdkConfiguration.fromJson(json.sdk);
		const data = json.authenticatorAllowlist;
		const authenticatorAllowlist = data.flatMap((allowedAuthenticator: string) => {
			return AuthenticatorUtils.getAaidFromRawValue(allowedAuthenticator) || [];
		});
		return new AppConfiguration(sdk, authenticatorAllowlist, json.loginRequestURL);
	}
}
