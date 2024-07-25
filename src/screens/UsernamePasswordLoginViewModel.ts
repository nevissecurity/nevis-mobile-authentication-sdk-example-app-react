/**
 * Copyright © 2023 Nevis Security AG. All rights reserved.
 */

import { useState } from 'react';

import {
	AuthorizationProvider,
	CookieAuthorizationProvider,
	CookieContainer,
} from '@nevis-security/nevis-mobile-authentication-sdk-react';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { splitCookiesString } from 'set-cookie-parser';

import type { RootStackParamList } from './RootStackParamList';
import { ConfigurationLoader } from '../configuration/ConfigurationLoader';
import {
	AppErrorCookieNotFound,
	AppErrorLoginDataNotFound,
	AppErrorLoginError,
	AppErrorReadLoginConfigurationError,
} from '../error/AppError';
import { ErrorHandler } from '../error/ErrorHandler';
import { OperationType } from '../model/OperationType';
import {
	AuthenticatorSelectorImpl,
	AuthenticatorSelectorOperation,
} from '../userInteraction/AuthenticatorSelectorImpl';
import { BiometricUserVerifierImpl } from '../userInteraction/BiometricUserVerifierImpl';
import { DevicePasscodeUserVerifierImpl } from '../userInteraction/DevicePasscodeUserVerifierImpl';
import { FingerprintUserVerifierImpl } from '../userInteraction/FingerprintUserVerifierImpl';
import { PasswordEnrollerImpl } from '../userInteraction/PasswordEnrollerImpl';
import { PinEnrollerImpl } from '../userInteraction/PinEnrollerImpl';
import { ClientProvider } from '../utility/ClientProvider';
import { DeviceInformationUtils } from '../utility/DeviceInformationUtils';

const useUsernamePasswordLoginViewModel = () => {
	const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');

	async function register(
		usernameToRegister: string,
		authorizationProvider: AuthorizationProvider
	) {
		// Nevis Mobile Authentication SDK supports registering authenticators in multiple servers.
		// You can specify the base URL of the server where the registration should be made,
		// see {@link Registration.serverUrl}. If no server base URL is provided, then the base URL
		// defined in {@link Configuration.baseUrl} will be used.
		const client = ClientProvider.getInstance().client;
		await client?.operations.registration
			.username(usernameToRegister)
			.deviceInformation(DeviceInformationUtils.create())
			.authorizationProvider(authorizationProvider)
			.authenticatorSelector(
				new AuthenticatorSelectorImpl(AuthenticatorSelectorOperation.registration)
			)
			.pinEnroller(new PinEnrollerImpl())
			.passwordEnroller(new PasswordEnrollerImpl())
			.biometricUserVerifier(new BiometricUserVerifierImpl())
			.devicePasscodeUserVerifier(new DevicePasscodeUserVerifierImpl())
			.fingerprintUserVerifier(new FingerprintUserVerifierImpl())
			.onSuccess(() => {
				console.log('In-band registration succeeded.');
				navigation.navigate('Result', {
					operation: OperationType.registration,
				});
			})
			.onError(ErrorHandler.handle.bind(null, OperationType.registration))
			.execute()
			.catch(ErrorHandler.handle.bind(null, OperationType.registration));
	}

	const requestBody = () => {
		const params = { isiwebuserid: username, isiwebpasswd: password };
		const formBody = [];
		for (const key in params) {
			const encodedKey = encodeURIComponent(key);

			const encodedValue = encodeURIComponent(params[key as keyof typeof params]);
			formBody.push(encodedKey + '=' + encodedValue);
		}
		return formBody.join('&');
	};

	const options = {
		method: 'POST',
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
		},
		body: requestBody(),
	};

	async function login(url: string) {
		fetch(url, options)
			.then((response) => {
				const setCookies = response.headers.get('Set-Cookie');
				return Promise.all([response.json(), Promise.resolve(setCookies)]);
			})
			.then((results) => {
				const json = results.at(0);
				const setCookies = results.at(1);
				if (!setCookies) {
					throw new AppErrorCookieNotFound();
				}

				const cookies = splitCookiesString(setCookies);
				const containers = cookies.map((cookie) => new CookieContainer(url, cookie));

				const authorizationProvider = CookieAuthorizationProvider.create(containers);
				return register(json.extId, authorizationProvider);
			})
			.catch((error) => {
				throw new AppErrorLoginError(error.message);
			});
	}

	async function confirm() {
		if (!username || !password) {
			return ErrorHandler.handle(
				OperationType.authentication,
				new AppErrorLoginDataNotFound()
			);
		}
		const config = ConfigurationLoader.getInstance().appConfiguration;
		if (!config.loginRequestURL) {
			return ErrorHandler.handle(
				OperationType.authentication,
				new AppErrorReadLoginConfigurationError('Wrong configuration')
			);
		}

		await login(config.loginRequestURL).catch(
			ErrorHandler.handle.bind(null, OperationType.authentication)
		);
	}

	function cancel() {
		navigation.goBack();
	}

	return {
		setUsername,
		setPassword,
		confirm,
		cancel,
	};
};

export default useUsernamePasswordLoginViewModel;
