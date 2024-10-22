/**
 * Copyright © 2023 Nevis Security AG. All rights reserved.
 */

import { Configuration } from '@nevis-security/nevis-mobile-authentication-sdk-react';

import { AppConfiguration } from './AppConfiguration';
import authCloud from '../../assets/config_authentication_cloud.json';
import identitySuite from '../../assets/config_identity_suite.json';
import { AppErrorLoadAppConfigurationError } from '../error/AppError';
import { ErrorHandler } from '../error/ErrorHandler';
import { OperationType } from '../model/OperationType';

export enum AppEnvironment {
	AuthenticationCloud,
	IdentitySuite,
}

export class ConfigurationLoader {
	private static instance: ConfigurationLoader;
	private readonly _appEnvironment: AppEnvironment;
	private _appConfiguration?: AppConfiguration;
	private _sdkConfiguration?: Configuration;

	private constructor() {
		this._appEnvironment = AppEnvironment.IdentitySuite;
	}

	static getInstance(): ConfigurationLoader {
		if (!ConfigurationLoader.instance) {
			ConfigurationLoader.instance = new ConfigurationLoader();
		}

		return ConfigurationLoader.instance;
	}

	get appEnvironment() {
		return this._appEnvironment;
	}

	get appConfiguration(): AppConfiguration {
		if (this._appConfiguration) {
			return this._appConfiguration;
		}

		this._appConfiguration = AppConfiguration.fromJson(this.configJson());

		if (!this._appConfiguration) {
			ErrorHandler.handle(
				OperationType.unknown,
				new AppErrorLoadAppConfigurationError('Could not load configuration')
			);
		}

		return this._appConfiguration;
	}

	get sdkConfiguration(): Configuration {
		if (this._sdkConfiguration) {
			return this._sdkConfiguration;
		}

		const appConfiguration = this.appConfiguration;
		switch (this._appEnvironment) {
			case AppEnvironment.AuthenticationCloud:
				this._sdkConfiguration = Configuration.authCloudBuilder()
					.hostname(appConfiguration.sdk.hostname)
					.facetId(appConfiguration.sdk.facetId)
					.build();
				break;
			case AppEnvironment.IdentitySuite:
				this._sdkConfiguration = Configuration.builder()
					.baseUrl(appConfiguration.sdk.baseUrl)
					.facetId(appConfiguration.sdk.facetId)
					.registrationRequestPath(appConfiguration.sdk.registrationRequestPath!)
					.registrationResponsePath(appConfiguration.sdk.registrationResponsePath!)
					.authenticationRequestPath(appConfiguration.sdk.authenticationRequestPath!)
					.authenticationResponsePath(appConfiguration.sdk.authenticationResponsePath!)
					.deregistrationRequestPath(appConfiguration.sdk.deregistrationRequestPath!)
					.dispatchTargetResourcePath(appConfiguration.sdk.dispatchTargetResourcePath!)
					.deviceResourcePath(appConfiguration.sdk.deviceResourcePath!)
					.build();
				break;
		}

		return this._sdkConfiguration;
	}

	private configJson() {
		switch (this._appEnvironment) {
			case AppEnvironment.AuthenticationCloud:
				return authCloud;
			case AppEnvironment.IdentitySuite:
				return identitySuite;
			default:
				throw new AppErrorLoadAppConfigurationError('Unsupported environment.');
		}
	}
}
