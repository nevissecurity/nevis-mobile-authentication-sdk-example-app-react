/**
 * Copyright © 2023 Nevis Security AG. All rights reserved.
 */

import {
	AuthorizationProvider,
	type MobileAuthenticationClient,
	OutOfBandAuthentication,
	OutOfBandPayload,
	OutOfBandRegistration,
} from '@nevis-security/nevis-mobile-authentication-sdk-react';

import { AccountSelectorImpl } from './AccountSelectorImpl';
import {
	AuthenticatorSelectorImpl,
	AuthenticatorSelectorOperation,
} from './AuthenticatorSelectorImpl';
import { BiometricUserVerifierImpl } from './BiometricUserVerifierImpl';
import { DevicePasscodeUserVerifierImpl } from './DevicePasscodeUserVerifierImpl';
import { FingerprintUserVerifierImpl } from './FingerprintUserVerifierImpl';
import { PasswordEnrollerImpl } from './PasswordEnrollerImpl';
import { PasswordUserVerifierImpl } from './PasswordUserVerifierImpl';
import { PinEnrollerImpl } from './PinEnrollerImpl';
import { PinUserVerifierImpl } from './PinUserVerifierImpl';
import { AppErrorPayloadDecodeError, AppErrorQrCodeError } from '../error/AppError';
import { ErrorHandler } from '../error/ErrorHandler';
import { OperationType } from '../model/OperationType';
import { AuthorizationUtils } from '../utility/AuthorizationUtils';
import { ClientProvider } from '../utility/ClientProvider';
import { DeviceInformationUtils } from '../utility/DeviceInformationUtils';
import * as RootNavigation from '../utility/RootNavigation';

async function handleRegistration(registration: OutOfBandRegistration) {
	await registration
		.deviceInformation(DeviceInformationUtils.create())
		.authenticatorSelector(
			new AuthenticatorSelectorImpl(AuthenticatorSelectorOperation.registration)
		)
		.pinEnroller(new PinEnrollerImpl())
		.passwordEnroller(new PasswordEnrollerImpl())
		.biometricUserVerifier(new BiometricUserVerifierImpl())
		.devicePasscodeUserVerifier(new DevicePasscodeUserVerifierImpl())
		.fingerprintUserVerifier(new FingerprintUserVerifierImpl())
		.onSuccess(() => {
			console.log('Out-of-Band registration succeeded.');
			RootNavigation.navigate('Result', {
				operation: OperationType.registration,
			});
		})
		.onError(ErrorHandler.handle.bind(null, OperationType.registration))
		.execute();
}

async function handleAuthentication(authentication: OutOfBandAuthentication) {
	await authentication
		.accountSelector(new AccountSelectorImpl())
		.authenticatorSelector(
			new AuthenticatorSelectorImpl(AuthenticatorSelectorOperation.authentication)
		)
		.pinUserVerifier(new PinUserVerifierImpl())
		.passwordUserVerifier(new PasswordUserVerifierImpl())
		.biometricUserVerifier(new BiometricUserVerifierImpl())
		.devicePasscodeUserVerifier(new DevicePasscodeUserVerifierImpl())
		.fingerprintUserVerifier(new FingerprintUserVerifierImpl())
		.onSuccess((authorizationProvider?: AuthorizationProvider) => {
			console.log('Out-of-Band authentication succeeded.');
			AuthorizationUtils.printAuthorizationInfo(authorizationProvider);
			RootNavigation.navigate('Result', {
				operation: OperationType.authentication,
			});
		})
		.onError(ErrorHandler.handle.bind(null, OperationType.authentication))
		.execute();
}

async function handleOutOfBandPayload(
	payload: OutOfBandPayload,
	client?: MobileAuthenticationClient
) {
	client?.operations.outOfBandOperation
		.payload(payload)
		.onRegistration(async (registration) => {
			await handleRegistration(registration).catch(
				ErrorHandler.handle.bind(null, OperationType.registration)
			);
		})
		.onAuthentication(async (authentication) => {
			await handleAuthentication(authentication).catch(
				ErrorHandler.handle.bind(null, OperationType.authentication)
			);
		})
		.onError(ErrorHandler.handle.bind(null, OperationType.unknown))
		.execute()
		.catch(ErrorHandler.handle.bind(null, OperationType.unknown));
}

export async function decodePayload(base64UrlEncoded: string) {
	if (base64UrlEncoded === '') {
		return ErrorHandler.handle(OperationType.payloadDecode, new AppErrorQrCodeError());
	}

	const client = ClientProvider.getInstance().client;
	await client?.operations.outOfBandPayloadDecode
		.base64UrlEncoded(base64UrlEncoded)
		.onSuccess(async (payload) => {
			if (!payload) {
				return ErrorHandler.handle(
					OperationType.payloadDecode,
					new AppErrorPayloadDecodeError('No payload is returned by the SDK.')
				);
			}

			console.log('Out-of-Band payload decode succeeded.');
			await handleOutOfBandPayload(payload, client);
		})
		.onError(ErrorHandler.handle.bind(null, OperationType.payloadDecode))
		.execute();
}
