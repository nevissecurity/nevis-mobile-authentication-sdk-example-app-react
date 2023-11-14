/**
 * Copyright © 2023 Nevis Security AG. All rights reserved.
 */

import { useCallback } from 'react';
import { SafeAreaView, ScrollView, Text, View } from 'react-native';

import { useTranslation } from 'react-i18next';
import { useDynamicValue } from 'react-native-dynamic';

import useAuthCloudApiRegistrationViewModel from './AuthCloudApiRegistrationViewModel';
import InputField from '../components/InputField';
import OutlinedButton from '../components/OutlinedButton';
import { dynamicStyles } from '../Styles';

const AuthCloudApiRegistrationScreen = () => {
	const { setEnrollResponse, setAppLinkUri, confirm, cancel } =
		useAuthCloudApiRegistrationViewModel();

	const { t } = useTranslation();
	const styles = useDynamicValue(dynamicStyles);

	const onCancel = useCallback(async () => {
		cancel();
	}, []);

	return (
		<SafeAreaView style={styles.container}>
			<ScrollView contentContainerStyle={styles.container}>
				<View style={styles.titleContainer}>
					<Text style={styles.textTitle}>{t('authCloudApiRegistration.title')}</Text>
				</View>
				<View style={styles.middleContainer}>
					<Text style={styles.textNormal}>
						{t('authCloudApiRegistration.enrollResponse')}
					</Text>
					<InputField
						placeholder={t('authCloudApiRegistration.enrollResponse')}
						onChangeText={setEnrollResponse}
					/>
					<Text style={styles.textNormal}>
						{t('authCloudApiRegistration.appLinkUri')}
					</Text>
					<InputField
						placeholder={t('authCloudApiRegistration.appLinkUri')}
						onChangeText={setAppLinkUri}
					/>
				</View>
				<View style={styles.bottomContainer}>
					<OutlinedButton text={t('confirmButtonTitle')} onPress={confirm} />
					<OutlinedButton text={t('cancelButtonTitle')} onPress={onCancel} />
				</View>
			</ScrollView>
		</SafeAreaView>
	);
};

export default AuthCloudApiRegistrationScreen;
