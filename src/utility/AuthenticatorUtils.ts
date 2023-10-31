/**
 * Copyright © 2023 Nevis Security AG. All rights reserved.
 */

import { Platform } from 'react-native';

import { Aaid, Authenticator } from '@nevis-security/nevis-mobile-authentication-sdk-react';
import i18next from 'i18next';

export class AuthenticatorUtils {
	static localizedTitle(authenticator: Authenticator) {
		switch (authenticator.aaid) {
			case Aaid.PIN.rawValue():
				return i18next.t('authenticator.title.pin');
			case Aaid.BIOMETRIC.rawValue():
				return Platform.select({
					ios: () => {
						return i18next.t('authenticator.title.faceID');
					},
					android: () => {
						return i18next.t('authenticator.title.fingerprint');
					},
					default: () => {
						return '';
					},
				})();
			case Aaid.DEVICE_PASSCODE.rawValue():
				return i18next.t('authenticator.title.devicePasscode');
			case Aaid.FINGERPRINT.rawValue():
				return Platform.select({
					ios: () => {
						return i18next.t('authenticator.title.touchID');
					},
					android: () => {
						return i18next.t('authenticator.title.fingerprint');
					},
					default: () => {
						return '';
					},
				})();
			default:
				return `Unknown AAID: ${authenticator.aaid}`;
		}
	}
}
