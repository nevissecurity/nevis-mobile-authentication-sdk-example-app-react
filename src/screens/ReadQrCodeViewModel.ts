/**
 * Copyright © 2023 Nevis Security AG. All rights reserved.
 */

import { useEffect, useState } from 'react';

import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import type { RootStackParamList } from './RootStackParamList';
import { ErrorHandler } from '../error/ErrorHandler';
import { OperationType } from '../model/OperationType';
import * as OutOfBandOperationHandler from '../userInteraction/OutOfBandOperationHandler';

const useReadQrCodeViewModel = () => {
	const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

	const [dispatchTokenResponse, setDispatchTokenResponse] = useState('');

	useEffect(() => {
		if (dispatchTokenResponse) {
			decodeOutOfBandPayload(dispatchTokenResponse);
		}
	}, [dispatchTokenResponse]);

	function decodeOutOfBandPayload(dispatchTokenResponse: string) {
		OutOfBandOperationHandler.decodePayload(dispatchTokenResponse).catch(
			ErrorHandler.handle.bind(null, OperationType.payloadDecode)
		);
	}

	function close() {
		navigation.goBack();
	}

	return {
		setDispatchTokenResponse,
		close,
	};
};

export default useReadQrCodeViewModel;
