/**
 * Copyright © 2023 Nevis Security AG. All rights reserved.
 */

import React, { useEffect, useState } from 'react';
import { SafeAreaView, Text, View } from 'react-native';

import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import { useDynamicValue } from 'react-native-dynamic';
//import { PERMISSIONS, request, RESULTS } from 'react-native-permissions';
//import { ReactNativeScannerView } from '@pushpendersingh/react-native-scanner';

import type { RootStackParamList } from './RootStackParamList';
import CloseButton from '../components/CloseButton';
//import { AppErrorPermissionError } from '../error/AppError';
import { ErrorHandler } from '../error/ErrorHandler';
import { OperationType } from '../model/OperationType';
import { dynamicStyles } from '../Styles';
import * as OutOfBandOperationHandler from '../userInteraction/OutOfBandOperationHandler';

type Props = NativeStackScreenProps<RootStackParamList, 'ReadQrCode'>;

const ReadQrCodeScreen = ({ navigation }: Props) => {
	const { t } = useTranslation();
	const styles = useDynamicValue(dynamicStyles);
	//const { height, width } = useWindowDimensions();
	//const [hasPermission, setHasPermission] = useState(false);
	const [content, setContent] = useState('');
	//const [errorMessage, setErrorMessage] = useState('');

	// const checkCameraPermission = useCallback(async () => {
	// 	request(Platform.OS === 'ios' ? PERMISSIONS.IOS.CAMERA : PERMISSIONS.ANDROID.CAMERA).then(
	// 		async (result: any) => {
	// 			switch (result) {
	// 				case RESULTS.GRANTED:
	// 					setHasPermission(true);
	// 					setErrorMessage('');
	// 					break;
	// 				case RESULTS.UNAVAILABLE:
	// 					setErrorMessage(t('readQrCode.camera.initializationFailed'));
	// 					break;
	// 				case RESULTS.DENIED:
	// 					setErrorMessage(t('readQrCode.camera.accessDenied'));
	// 					break;
	// 				case RESULTS.BLOCKED:
	// 					setErrorMessage(t('readQrCode.camera.accessPermanentlyDenied'));
	// 					break;
	// 			}
	// 		}
	// 	);
	// }, [t]);

	// useEffect(() => {
	// 	checkCameraPermission().catch((error) => {
	// 		ErrorHandler.handle(OperationType.unknown, new AppErrorPermissionError(error.message));
	// 	});
	// }, [checkCameraPermission]);

	useEffect(() => {
		OutOfBandOperationHandler.decodePayload(content).catch(
			ErrorHandler.handle.bind(null, OperationType.payloadDecode)
		);
	}, [content]);

	function close() {
		// temporary solution to avoid linter errors
		setContent('');
		navigation.goBack();
	}

	// if (hasPermission) {
	// 	return (
	// 		<SafeAreaView style={styles.container}>
	// 			<View style={styles.transparentTitleBar}>
	// 				<CloseButton onPress={close} />
	// 				<Text style={styles.textTitle}>{t('readQrCode.title')}</Text>
	// 			</View>
	// 			<ReactNativeScannerView
	// 				style={{ height, width }}
	// 				onQrScanned={(value: any) => {
	// 					if (value.nativeEvent.value) {
	// 						// On Android every second value is undefined.
	// 						// This check is needed to be able to use `useState`.
	// 						setContent(value.nativeEvent.value);
	// 					}
	// 				}}
	// 			/>
	// 		</SafeAreaView>
	// 	);
	// } else {
	return (
		<SafeAreaView style={styles.container}>
			<CloseButton onPress={close} />
			<Text style={styles.textTitle}>{t('readQrCode.title')}</Text>
			<View style={styles.middleContainer}>
				{/*<Text style={[styles.textNormal, styles.textCenter]}>{errorMessage}</Text>*/}
				<Text style={[styles.textNormal, styles.textCenter]}>{'Not implemented'}</Text>
			</View>
		</SafeAreaView>
	);
	// }
};

export default ReadQrCodeScreen;
