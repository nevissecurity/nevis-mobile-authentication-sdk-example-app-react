/**
 * Copyright © 2023 Nevis Security AG. All rights reserved.
 */

import {
	AccountSelectionHandler,
	AuthorizationProvider,
} from '@nevis-security/nevis-mobile-authentication-sdk-react';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import type { RootStackParamList } from './RootStackParamList';
import { AppErrorAuthorizationProviderNotFound, AppErrorUnknownError } from '../error/AppError';
import { ErrorHandler } from '../error/ErrorHandler';
import { OperationType } from '../model/OperationType';
import { AuthenticationAuthenticatorSelectorImpl } from '../userInteraction/AuthenticationAuthenticatorSelectorImpl';
import { BiometricUserVerifierImpl } from '../userInteraction/BiometricUserVerifierImpl';
import { DevicePasscodeUserVerifierImpl } from '../userInteraction/DevicePasscodeUserVerifierImpl';
import { FingerprintUserVerifierImpl } from '../userInteraction/FingerprintUserVerifierImpl';
import { PasswordChangerImpl } from '../userInteraction/PasswordChangerImpl';
import { PasswordUserVerifierImpl } from '../userInteraction/PasswordUserVerifierImpl';
import { PinChangerImpl } from '../userInteraction/PinChangerImpl';
import { PinUserVerifierImpl } from '../userInteraction/PinUserVerifierImpl';
import { AuthorizationUtils } from '../utility/AuthorizationUtils';
import { ClientProvider } from '../utility/ClientProvider';
import * as RootNavigation from '../utility/RootNavigation';

const useSelectAccountViewModel = () => {
	const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

	async function select(
		username: string,
		operation: OperationType,
		transactionConfirmationData?: string,
		handler?: AccountSelectionHandler
	) {
		if (transactionConfirmationData) {
			// Transaction confirmation data is received from the SDK
			// Show it to the user for confirmation or cancellation
			// The AccountSelectionHandler will be invoked or cancelled there.
			RootNavigation.navigate('TransactionConfirmation', {
				transactionConfirmationData: transactionConfirmationData,
				selectedUsername: username,
				accountSelectionHandler: handler,
			});
			return;
		}
		switch (operation) {
			case OperationType.authentication:
			case OperationType.deregistration:
				await authenticate(username, operation);
				break;
			case OperationType.pinChange:
				await pinChange(username, operation);
				break;
			case OperationType.passwordChange:
				await passwordChange(username, operation);
				break;
			default:
				await handler?.username(username).catch((error) => {
					ErrorHandler.handle.bind(
						null,
						operation,
						new AppErrorUnknownError('Account selection failed', error.message)
					);
				});
		}
	}

	async function authenticate(username: string, operation: OperationType) {
		const client = ClientProvider.getInstance().client;
		client?.operations.authentication
			.username(username)
			.authenticatorSelector(new AuthenticationAuthenticatorSelectorImpl())
			.pinUserVerifier(new PinUserVerifierImpl())
			.passwordUserVerifier(new PasswordUserVerifierImpl())
			.biometricUserVerifier(new BiometricUserVerifierImpl())
			.devicePasscodeUserVerifier(new DevicePasscodeUserVerifierImpl())
			.fingerprintUserVerifier(new FingerprintUserVerifierImpl())
			.onSuccess(async (authorizationProvider?: AuthorizationProvider) => {
				console.log('In-Band authentication succeeded.');
				AuthorizationUtils.printAuthorizationInfo(authorizationProvider);
				switch (operation) {
					case OperationType.authentication:
						navigation.navigate('Result', {
							operation: operation,
						});
						break;
					case OperationType.deregistration:
						if (!authorizationProvider) {
							return ErrorHandler.handle(
								operation,
								new AppErrorAuthorizationProviderNotFound(
									'Missing authorization provider for deregistration.'
								)
							);
						}
						await deregister(username, operation, authorizationProvider);
						break;
					default:
						ErrorHandler.handle(
							operation,
							new AppErrorUnknownError('Unsupported operation type.')
						);
				}
			})
			.onError((error) => {
				AuthorizationUtils.printSessionInfo(error.sessionProvider);
				ErrorHandler.handle(operation, error);
			})
			.execute()
			.catch(ErrorHandler.handle.bind(null, operation));
	}

	async function deregister(
		username: string,
		operation: OperationType,
		authorizationProvider: AuthorizationProvider
	) {
		const client = ClientProvider.getInstance().client;
		client?.operations.deregistration
			.username(username)
			.authorizationProvider(authorizationProvider)
			.onSuccess(() => {
				console.log('Deregistration succeeded.');
				navigation.navigate('Result', {
					operation: operation,
				});
			})
			.onError(ErrorHandler.handle.bind(null, operation))
			.execute();
	}

	async function pinChange(username: string, operation: OperationType) {
		const client = ClientProvider.getInstance().client;
		client?.operations.pinChange
			.username(username)
			.pinChanger(new PinChangerImpl())
			.onSuccess(() => {
				console.log('PIN Change succeeded.');
				navigation.navigate('Result', {
					operation: operation,
				});
			})
			.onError(ErrorHandler.handle.bind(null, OperationType.pinChange))
			.execute()
			.catch(ErrorHandler.handle.bind(null, operation));
	}

	async function passwordChange(username: string, operation: OperationType) {
		const client = ClientProvider.getInstance().client;
		client?.operations.passwordChange
			.username(username)
			.passwordChanger(new PasswordChangerImpl())
			.onSuccess(() => {
				console.log('Password Change succeeded.');
				navigation.navigate('Result', {
					operation: operation,
				});
			})
			.onError(ErrorHandler.handle.bind(null, OperationType.passwordChange))
			.execute()
			.catch(ErrorHandler.handle.bind(null, operation));
	}

	return {
		select,
	};
};

export default useSelectAccountViewModel;
