/**
 * Copyright © 2023 Nevis Security AG. All rights reserved.
 */

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

	constructor(
		baseUrl: string,
		hostname: string,
		facetId: string,
		registrationRequestPath?: string,
		registrationResponsePath?: string,
		authenticationRequestPath?: string,
		authenticationResponsePath?: string,
		deregistrationRequestPath?: string,
		dispatchTargetResourcePath?: string
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
	}
}
export class AppConfiguration {
	sdk: SdkConfiguration;
	loginRequestURL?: string;

	constructor(sdk: SdkConfiguration, loginRequestURL?: string) {
		this.sdk = sdk;
		this.loginRequestURL = loginRequestURL;
	}
}
