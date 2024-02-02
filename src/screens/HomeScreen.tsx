/**
 * Copyright © 2023 Nevis Security AG. All rights reserved.
 */

import { useCallback, useEffect } from 'react';
import { Linking, ScrollView, Text, useColorScheme, View } from 'react-native';

import { useFocusEffect } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import useHomeViewModel from './HomeViewModel';
import OutlinedButton from '../components/OutlinedButton';
import { ErrorHandler } from '../error/ErrorHandler';
import { OperationType } from '../model/OperationType';
import { darkStyle, lightStyle } from '../Styles';

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
	const colorScheme = useColorScheme();
	const styles = colorScheme === 'dark' ? darkStyle : lightStyle;
	const insets = useSafeAreaInsets();

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
			<ScrollView contentContainerStyle={styles.contentContainer}>
				<View style={styles.titleContainer}>
					<Text style={[styles.textForeground, styles.textTitle]}>{t('home.title')}</Text>
					<Text style={[styles.textForeground, styles.textNormal]}>
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
						text={t('home.deleteAuthenticators')}
						onPress={deleteLocalAuthenticators}
					/>
					<Text style={[styles.textForeground, styles.textNormal]}>
						{t('home.identitySuiteOnly')}
					</Text>
					<OutlinedButton text={t('home.inBandRegister')} onPress={inBandRegister} />
				</View>
			</ScrollView>
		</View>
	);
};

export default HomeScreen;
