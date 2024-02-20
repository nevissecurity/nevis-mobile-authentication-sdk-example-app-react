/**
 * Copyright © 2023 Nevis Security AG. All rights reserved.
 */

import { useCallback, useState } from 'react';
import { ActivityIndicator, Platform, StyleSheet, Text, useColorScheme, View } from 'react-native';

import { useAppState } from '@react-native-community/hooks';
import { useIsFocused } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import {
	check as checkPermission,
	PERMISSIONS,
	request as requestPermission,
	RESULTS,
} from 'react-native-permissions';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Camera, useCameraDevice, useCodeScanner } from 'react-native-vision-camera';

import useReadQrCodeViewModel from './ReadQrCodeViewModel';
import CloseButton from '../components/CloseButton';
import { darkStyle, lightStyle } from '../Styles';

const ReadQrCodeScreen = () => {
	const { setDispatchTokenResponse, close } = useReadQrCodeViewModel();

	const { t } = useTranslation();
	const colorScheme = useColorScheme();
	const styles = colorScheme === 'dark' ? darkStyle : lightStyle;
	const insets = useSafeAreaInsets();

	const [errorMessage, setErrorMessage] = useState('');
	const [isLoading, setLoading] = useState(false);

	const cameraPermission =
		Platform.OS == 'ios' ? PERMISSIONS.IOS.CAMERA : PERMISSIONS.ANDROID.CAMERA;
	const [hasCameraPermission, setHasCameraPermission] = useState(false);
	const isFocused = useIsFocused();
	const appState = useAppState();
	const isActive = isFocused && appState === 'active' && !isLoading;

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

	const device = useCameraDevice('back');

	if (!device && !errorMessage) {
		setErrorMessage(t('readQrCode.camera.initializationFailed'));
	}

	const codeScanner = useCodeScanner({
		codeTypes: ['qr'],
		onCodeScanned: (codes) => {
			const value = codes[0]?.value;
			if (value) {
				setLoading(true);
				setDispatchTokenResponse(value);
			}
		},
	});

	return (
		<View
			style={[
				styles.container,
				{
					paddingTop: insets.top,
					paddingBottom: insets.bottom,
					paddingLeft: insets.left,
					paddingRight: insets.right,
				},
			]}
		>
			<CloseButton onPress={onClose} />
			<Text style={[styles.textForeground, styles.textTitle]}>{t('readQrCode.title')}</Text>
			<View style={styles.middleContainer}>
				{isLoading && <ActivityIndicator size="large" />}
				{!isLoading && device && hasCameraPermission && (
					<Camera
						style={StyleSheet.absoluteFill}
						device={device}
						codeScanner={codeScanner}
						isActive={isActive}
					/>
				)}
				{!isLoading && errorMessage && (
					<Text style={[styles.textForeground, styles.textNormal, styles.textCenter]}>
						{errorMessage}
					</Text>
				)}
			</View>
		</View>
	);
};

export default ReadQrCodeScreen;
