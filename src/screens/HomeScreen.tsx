/**
 * Copyright © 2023 Nevis Security AG. All rights reserved.
 */

import React, { useCallback, useEffect } from 'react';
import { Linking, SafeAreaView, ScrollView, Text, View } from 'react-native';

import { useFocusEffect } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { useDynamicValue } from 'react-native-dynamic';

import useHomeViewModel from './HomeViewModel';
import OutlinedButton from '../components/OutlinedButton';
import { ErrorHandler } from '../error/ErrorHandler';
import { OperationType } from '../model/OperationType';
import { dynamicStyles } from '../Styles';

const HomeScreen = () => {
	const {
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
	} = useHomeViewModel();

	const { t } = useTranslation();
	const styles = useDynamicValue(dynamicStyles);

	// Updating screen upon focus
	useFocusEffect(
		useCallback(() => {
			fetchData();
		}, [])
	);

	const onInitClient = useCallback(async () => {
		await initClient();
	}, []);

	const onHandleDeepLink = useCallback(async ({ url }: { url: string }) => {
		handleDeepLink(url);
	}, []);

	useEffect(() => {
		const linkingEvent = Linking.addEventListener('url', onHandleDeepLink);
		onInitClient()
			.then(Linking.getInitialURL)
			.then((url) => {
				if (url) {
					onHandleDeepLink({ url }).catch(
						ErrorHandler.handle.bind(null, OperationType.unknown)
					);
				}
			});
		return () => {
			linkingEvent.remove();
		};
	}, [onInitClient, onHandleDeepLink]);

	return (
		<SafeAreaView style={styles.container}>
			<ScrollView contentContainerStyle={styles.container}>
				<View style={styles.titleContainer}>
					<Text style={styles.textTitle}>{t('home.title')}</Text>
					<Text style={styles.textNormal}>
						{t('home.registeredAccounts', { numberOfAccounts: numberOfAccounts })}
					</Text>
				</View>
				<View style={styles.middleContainer} />
				<View style={styles.bottomContainer}>
					<OutlinedButton text={t('home.readQrCode')} onPress={readQrCode} />
					<OutlinedButton
						text={t('home.inBandAuthenticate')}
						onPress={inBandAuthenticate}
					/>
					<OutlinedButton text={t('home.deregister')} onPress={deregister} />
					<OutlinedButton
						text={t('home.deviceInformationChange')}
						onPress={changeDeviceInformation}
					/>
					<OutlinedButton text={t('home.pinChange')} onPress={changePin} />
					<OutlinedButton
						text={t('home.authCloudApiRegistration')}
						onPress={authCloudApiRegister}
					/>
					<OutlinedButton
						text="Delete Authenticators"
						onPress={deleteLocalAuthenticators}
					/>
					<Text style={styles.textNormal}>{t('home.identitySuiteOnly')}</Text>
					<OutlinedButton text={t('home.inBandRegister')} onPress={inBandRegister} />
				</View>
			</ScrollView>
		</SafeAreaView>
	);
};

export default HomeScreen;
