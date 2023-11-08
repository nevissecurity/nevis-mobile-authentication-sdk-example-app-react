/**
 * Copyright © 2023 Nevis Security AG. All rights reserved.
 */

import { useState } from 'react';

import {
	Aaid,
	Account,
	Authenticator,
	MobileAuthenticationClientInitializer,
} from '@nevis-security/nevis-mobile-authentication-sdk-react';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import type { RootStackParamList } from './RootStackParamList';
import { AppEnvironment, ConfigurationLoader } from '../configuration/ConfigurationLoader';
import {
	AppErrorAccountsNotFound,
	AppErrorDeviceInformationNotFound,
	AppErrorPinAuthenticatorNotFound,
} from '../error/AppError';
import { ErrorHandler } from '../error/ErrorHandler';
import { AccountItem } from '../model/AccountItem';
import { OperationType } from '../model/OperationType';
import * as OutOfBandOperationHandler from '../userInteraction/OutOfBandOperationHandler';
import { PinChangerImpl } from '../userInteraction/PinChangerImpl';
import { ClientProvider } from '../utility/ClientProvider';
import * as RootNavigation from '../utility/RootNavigation';

const useHomeViewModel = () => {
	const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

	const [localAccounts, setLocalAccounts] = useState<Array<Account>>([]);
	const [localAuthenticators, setLocalAuthenticators] = useState<Array<Authenticator>>([]);
	const [numberOfAccounts, setNumberOfAccounts] = useState<number>(0);

	async function initClient() {
		console.log('Initializing the client...');
		const configuration = ConfigurationLoader.getInstance().sdkConfiguration;
		await new MobileAuthenticationClientInitializer()
			.configuration(configuration)
			.onSuccess(async (mobileAuthenticationClient) => {
				ClientProvider.getInstance().client = mobileAuthenticationClient;
				console.log('Client received.');
				fetchData();
			})
			.onError(ErrorHandler.handle.bind(null, OperationType.init))
			.execute()
			.catch(ErrorHandler.handle.bind(null, OperationType.init));
	}

	function handleDeepLink(url: string) {
		const payload = url
			.split('?')
			.at(1)
			?.split('&')
			.filter((queryParam) => queryParam.split('=').at(0) == 'dispatchTokenResponse')
			.at(0)
			?.split('=')
			.at(1);
		console.log(`Dispatch token response: ${payload}`);
		if (payload) {
			OutOfBandOperationHandler.decodePayload(payload).catch(
				ErrorHandler.handle.bind(null, OperationType.payloadDecode)
			);
		}
	}

	function fetchData() {
		getAccounts().then(getAuthenticators).then(getDeviceInformation);
	}

	async function getAccounts() {
		const client = ClientProvider.getInstance().client;
		await client?.localData
			.accounts()
			.then((registeredAccounts) => {
				if (registeredAccounts.length === 0) {
					setNumberOfAccounts(0);
					setLocalAccounts([]);
					return console.log('There are no registered accounts.');
				}

				console.log('Registered accounts:');
				registeredAccounts.forEach((account) => {
					console.log(`   ${JSON.stringify(account, null, ' ')}`);
				});

				setNumberOfAccounts(registeredAccounts.length);
				setLocalAccounts(registeredAccounts);
			})
			.catch(ErrorHandler.handle.bind(null, OperationType.localData));
	}

	async function getAuthenticators() {
		const client = ClientProvider.getInstance().client;
		await client?.localData
			.authenticators()
			.then((authenticators) => {
				if (authenticators.length === 0) {
					return console.log('There are no available authenticators.');
				}

				console.log('Available authenticators:');
				authenticators.forEach((authenticator) => {
					console.log(`   ${JSON.stringify(authenticator, null, ' ')}`);
				});
				setLocalAuthenticators(authenticators);
			})
			.catch(ErrorHandler.handle.bind(null, OperationType.localData));
	}

	async function getDeviceInformation() {
		const client = ClientProvider.getInstance().client;
		await client?.localData
			.deviceInformation()
			.then((deviceInformation) => {
				if (!deviceInformation) {
					return console.log('There is no available device info.');
				}

				console.log(
					`Available device info: ${JSON.stringify(deviceInformation, null, ' ')}`
				);
			})
			.catch(ErrorHandler.handle.bind(null, OperationType.localData));
	}

	function readQrCode() {
		navigation.navigate('ReadQrCode');
	}

	function authCloudApiRegister() {
		navigation.navigate('AuthCloudApiRegistration');
	}

	function inBandRegister() {
		navigation.navigate('UsernamePasswordLogin');
	}

	function selectAccount(operation: OperationType) {
		navigation.navigate('SelectAccount', {
			items: localAccounts.map((account) => new AccountItem(account.username)),
			operation: operation,
		});
	}

	function inBandAuthenticate() {
		if (localAccounts.length === 0) {
			return ErrorHandler.handle(
				OperationType.authentication,
				new AppErrorAccountsNotFound('There are no registered accounts')
			);
		}

		selectAccount(OperationType.authentication);
	}

	function deregister() {
		const client = ClientProvider.getInstance().client;
		if (localAccounts.length === 0) {
			return ErrorHandler.handle(
				OperationType.deregistration,
				new AppErrorAccountsNotFound('There are no registered accounts')
			);
		}

		if (ConfigurationLoader.getInstance().appEnvironment === AppEnvironment.IdentitySuite) {
			// In the example app Identity Suite environment the deregistration endpoint is guarded,
			// and as such we need to provide a cookie to the deregister call.
			// Also on Identity Suite a deregistration has to be authenticated for every user,
			// so batch deregistration is not really possible.
			return selectAccount(OperationType.deregistration);
		}

		return localAccounts
			.reduce(
				(previous, account) => previous.then(startDeregistration.bind(null, account)),
				Promise.resolve()
			)
			.then(() => {
				navigation.navigate('Result', { operation: OperationType.deregistration });
			})
			.catch(ErrorHandler.handle.bind(null, OperationType.deregistration));

		async function startDeregistration(account: Account) {
			return new Promise<void>((resolve, reject) => {
				client?.operations.deregistration
					.username(account.username)
					.onSuccess(() => {
						console.log(
							`Deregistration successful for account: ${JSON.stringify(
								account,
								null,
								' '
							)}`
						);
						resolve();
					})
					.onError(reject)
					.execute()
					.catch(reject);
				console.log(
					`Executing deregistration for account: ${JSON.stringify(account, null, ' ')}`
				);
			});
		}
	}

	async function changeDeviceInformation() {
		const client = ClientProvider.getInstance().client;
		await client?.localData
			.deviceInformation()
			.then((deviceInformation) => {
				if (!deviceInformation) {
					throw new AppErrorDeviceInformationNotFound(
						'There is no available device info.'
					);
				}

				console.log(`Available device info: ${deviceInformation}`);
				navigation.navigate('DeviceInformationChange', {
					name: deviceInformation.name,
				});
			})
			.catch(ErrorHandler.handle.bind(null, OperationType.deviceInformationChange));
	}

	async function deleteLocalAuthenticators() {
		const client = ClientProvider.getInstance().client;
		if (localAccounts.length === 0) {
			return ErrorHandler.handle(
				OperationType.localData,
				new AppErrorAccountsNotFound('There are no registered accounts')
			);
		}

		return localAccounts
			.reduce(
				(previous, account) =>
					previous.then(startLocalAuthenticatorDeletion.bind(null, account)),
				Promise.resolve()
			)
			.then(() => {
				navigation.navigate('Result', { operation: OperationType.localData });
			})
			.catch(ErrorHandler.handle.bind(null, OperationType.localData));

		async function startLocalAuthenticatorDeletion(account: Account) {
			return new Promise<void>((resolve, reject) => {
				console.log(
					`Executing deregistration for account: ${JSON.stringify(account, null, ' ')}`
				);
				client?.localData.deleteAuthenticator(account.username).then(resolve).catch(reject);
			});
		}
	}

	async function changePin() {
		// we should only pass the accounts to the account selection that already have a pin enrollment
		const filteredAuthenticators = localAuthenticators.filter((authenticator) => {
			return authenticator.aaid === Aaid.PIN.rawValue();
		});
		const pinAuthenticator = filteredAuthenticators.at(0);
		if (!pinAuthenticator) {
			return ErrorHandler.handle(
				OperationType.pinChange,
				new AppErrorPinAuthenticatorNotFound(
					'Pin change failed, there are no registered PIN authenticators'
				)
			);
		}

		const userEnrollment = pinAuthenticator.userEnrollment;
		const eligibleAccounts = localAccounts.filter((account) => {
			return userEnrollment.isEnrolled(account.username);
		});
		if (eligibleAccounts.length === 0) {
			return ErrorHandler.handle(
				OperationType.pinChange,
				new AppErrorAccountsNotFound(`Pin change failed, no eligible accounts found`)
			);
		} else if (eligibleAccounts.length === 1) {
			// in case that there is only one account, then we can select it automatically
			console.log('Automatically selecting account for PIN Change');
			await startPinChange(eligibleAccounts);
		} else {
			// in case that there are multiple eligible accounts then we have to show the account selection screen
			return selectAccount(OperationType.pinChange);
		}

		async function startPinChange(accounts: Array<Account>) {
			const client = ClientProvider.getInstance().client;
			client?.operations.pinChange
				.username(accounts.at(0)!.username)
				.pinChanger(new PinChangerImpl())
				.onSuccess(() => {
					console.log('PIN Change succeeded.');
					RootNavigation.navigate('Result', {
						operation: OperationType.pinChange,
					});
				})
				.onError(ErrorHandler.handle.bind(null, OperationType.pinChange))
				.execute()
				.catch(ErrorHandler.handle.bind(null, OperationType.pinChange));
		}
	}

	return {
		numberOfAccounts,
		initClient,
		fetchData,
		handleDeepLink,
		readQrCode,
		authCloudApiRegister,
		inBandRegister,
		inBandAuthenticate,
		deregister,
		changeDeviceInformation,
		deleteLocalAuthenticators,
		changePin,
	};
};

export default useHomeViewModel;
