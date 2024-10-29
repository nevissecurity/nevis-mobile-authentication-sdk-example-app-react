/**
 * Copyright © 2023 Nevis Security AG. All rights reserved.
 */

import { Platform } from 'react-native';

import DeviceInfo from 'react-native-device-info';

import { DeviceInformation } from '@nevis-security/nevis-mobile-authentication-sdk-react';

export class DeviceInformationUtils {
	static create() {
		const date = new Date();
		const year = date.getFullYear();
		const month = String(date.getMonth() + 1).padStart(2, '0');
		const day = String(date.getDate()).padStart(2, '0');
		const hours = String(date.getHours()).padStart(2, '0');
		const minutes = String(date.getMinutes()).padStart(2, '0');
		const seconds = String(date.getSeconds()).padStart(3, '0');
		const formattedDate = `${year}.${month}.${day} ${hours}:${minutes}:${seconds}`;

		let deviceName: string = 'Unknown';
		Platform.select({
			ios: () => {
				deviceName = `iOS ${DeviceInfo.getModel()}`;
			},
			android: () => {
				deviceName = `Android ${DeviceInfo.getManufacturerSync()} ${DeviceInfo.getModel()}`;
			},
			default: () => {
				deviceName = 'Unknown';
			},
		})();

		return DeviceInformation.create(`${deviceName} ${formattedDate}`);
	}
}
