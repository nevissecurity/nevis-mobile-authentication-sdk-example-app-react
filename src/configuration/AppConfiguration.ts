/**
 * Copyright © 2023 Nevis Security AG. All rights reserved.
 */
import { Aaid } from '@nevis-security/nevis-mobile-authentication-sdk-react';

import { AuthenticatorUtils } from '../utility/AuthenticatorUtils';

export class SdkConfiguration {
	baseUrl: string;
	hostname: string;
	facetId: string;
	registrationRequestPath?: string;
	registrationResponsePath?: string;
	authenticationRequestPath?: string;
	authenticationResponsePath?: string;
	deregistrationRequestPath?: string;
	dispatchTargetResourcePath?: string;
	deviceResourcePath?: string;

	private constructor(
		baseUrl: string,
		hostname: string,
		facetId: string,
		registrationRequestPath?: string,
		registrationResponsePath?: string,
		authenticationRequestPath?: string,
		authenticationResponsePath?: string,
		deregistrationRequestPath?: string,
		dispatchTargetResourcePath?: string,
		deviceResourcePath?: string
	) {
		this.baseUrl = baseUrl;
		this.hostname = hostname;
		this.facetId = facetId;
		this.registrationRequestPath = registrationRequestPath;
		this.registrationResponsePath = registrationResponsePath;
		this.authenticationRequestPath = authenticationRequestPath;
		this.authenticationResponsePath = authenticationResponsePath;
		this.deregistrationRequestPath = deregistrationRequestPath;
		this.dispatchTargetResourcePath = dispatchTargetResourcePath;
		this.deviceResourcePath = deviceResourcePath;
	}

	static fromJson(json: any): SdkConfiguration {
		return new SdkConfiguration(
			json.baseUrl,
			json.hostname,
			json.facetId,
			json.registrationRequestPath,
			json.registrationResponsePath,
			json.authenticationRequestPath,
			json.authenticationResponsePath,
			json.deregistrationRequestPath,
			json.dispatchTargetResourcePath,
			json.deviceResourcePath
		);
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
