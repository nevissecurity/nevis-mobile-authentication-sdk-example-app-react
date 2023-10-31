/**
 * Copyright © 2023 Nevis Security AG. All rights reserved.
 */

import { useState } from 'react';

import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import type { RootStackParamList } from './RootStackParamList';
import { ErrorHandler } from '../error/ErrorHandler';
import { OperationType } from '../model/OperationType';
import { ClientProvider } from '../utility/ClientProvider';

const useDeviceInformationChangeViewModel = () => {
	const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

	const [deviceName, setDeviceName] = useState('');

	async function confirm() {
		console.log('Change device information.');
		const client = ClientProvider.getInstance().client;
		await client?.operations.deviceInformationChange
			.name(deviceName)
			.onSuccess(() => {
				console.log('Change device information succeeded.');
				navigation.navigate('Result', {
					operation: OperationType.deviceInformationChange,
				});
			})
			.onError(ErrorHandler.handle.bind(null, OperationType.deviceInformationChange))
			.execute()
			.catch(ErrorHandler.handle.bind(null, OperationType.deviceInformationChange));
	}

	async function cancel() {
		navigation.goBack();
	}

	return {
		setDeviceName,
		confirm,
		cancel,
	};
};

export default useDeviceInformationChangeViewModel;
