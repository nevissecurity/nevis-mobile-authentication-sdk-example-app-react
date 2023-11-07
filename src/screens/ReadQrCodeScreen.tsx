/**
 * Copyright © 2023 Nevis Security AG. All rights reserved.
 */

import React, { useCallback, useState } from 'react';
import { Platform, SafeAreaView, StyleSheet, Text, View } from 'react-native';

import { useTranslation } from 'react-i18next';
import { useDynamicValue } from 'react-native-dynamic';
import {
	check as checkPermission,
	PERMISSIONS,
	request as requestPermission,
	RESULTS,
} from 'react-native-permissions';
import { Camera, useCameraDevice, useCodeScanner } from 'react-native-vision-camera';

import useReadQrCodeViewModel from './ReadQrCodeViewModel';
import CloseButton from '../components/CloseButton';
import { dynamicStyles } from '../Styles';

const ReadQrCodeScreen = () => {
	const { setDispatchTokenResponse, close } = useReadQrCodeViewModel();

	const { t } = useTranslation();
	const styles = useDynamicValue(dynamicStyles);

	const [errorMessage, setErrorMessage] = useState('');

	const cameraPermission =
		Platform.OS == 'ios' ? PERMISSIONS.IOS.CAMERA : PERMISSIONS.ANDROID.CAMERA;
	const [hasCameraPermission, setHasCameraPermission] = useState(false);
	const device = useCameraDevice('back');

	const codeScanner = useCodeScanner({
		codeTypes: ['qr'],
		onCodeScanned: (codes) => {
			const value = codes[0]?.value;
			if (value) {
				setDispatchTokenResponse(value);
			}
		},
	});

	function requestCameraPermission() {
		requestPermission(cameraPermission).then((result) => {
			switch (result) {
				case RESULTS.DENIED:
					setErrorMessage(t('readQrCode.camera.accessDenied'));
					setHasCameraPermission(false);
					break;
				case RESULTS.GRANTED:
					setErrorMessage('');
					setHasCameraPermission(true);
					break;
				case RESULTS.BLOCKED:
					setErrorMessage(t('readQrCode.camera.accessPermanentlyDenied'));
					setHasCameraPermission(false);
					break;
			}
		});
	}

	const onClose = useCallback(async () => {
		close();
	}, []);

	if (!device && !errorMessage) {
		setErrorMessage(t('readQrCode.camera.initializationFailed'));
	}

	if (!hasCameraPermission && !errorMessage) {
		checkPermission(cameraPermission).then((result) => {
			switch (result) {
				case RESULTS.UNAVAILABLE:
					setErrorMessage(t('readQrCode.camera.initializationFailed'));
					setHasCameraPermission(false);
					break;
				case RESULTS.DENIED:
					requestCameraPermission();
					break;
				case RESULTS.GRANTED:
					setErrorMessage('');
					setHasCameraPermission(true);
					break;
				case RESULTS.BLOCKED:
					setErrorMessage(t('readQrCode.camera.accessPermanentlyDenied'));
					setHasCameraPermission(false);
					break;
			}
		});
	}

	return (
		<SafeAreaView style={styles.container}>
			<CloseButton onPress={onClose} />
			<Text style={styles.textTitle}>{t('readQrCode.title')}</Text>
			<View style={styles.middleContainer}>
				{device && hasCameraPermission && (
					<Camera
						style={StyleSheet.absoluteFill}
						device={device}
						codeScanner={codeScanner}
						isActive={true}
					/>
				)}
				{errorMessage && (
					<Text style={[styles.textNormal, styles.textCenter]}>{errorMessage}</Text>
				)}
			</View>
		</SafeAreaView>
	);
};

export default ReadQrCodeScreen;
