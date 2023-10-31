/**
 * Copyright © 2023 Nevis Security AG. All rights reserved.
 */

import React, { useCallback } from 'react';
import { SafeAreaView, ScrollView, Text, View } from 'react-native';

import { useTranslation } from 'react-i18next';
import { useDynamicValue } from 'react-native-dynamic';

import useUsernamePasswordLoginViewModel from './UsernamePasswordLoginViewModel';
import InputField from '../components/InputField';
import OutlinedButton from '../components/OutlinedButton';
import { dynamicStyles } from '../Styles';

const UsernamePasswordLoginScreen = () => {
	const { setUsername, setPassword, confirm, cancel } = useUsernamePasswordLoginViewModel();

	const { t } = useTranslation();
	const styles = useDynamicValue(dynamicStyles);

	const onCancel = useCallback(async () => {
		cancel();
	}, []);

	return (
		<SafeAreaView style={styles.container}>
			<ScrollView contentContainerStyle={styles.container}>
				<View style={styles.titleContainer}>
					<Text style={styles.textTitle}>{t('usernamePasswordLogin.title')}</Text>
				</View>
				<View style={styles.middleContainer}>
					<Text style={styles.textNormal}>{t('usernamePasswordLogin.username')}</Text>
					<InputField
						placeholder={t('usernamePasswordLogin.username')}
						onChangeText={setUsername}
					/>
					<Text style={styles.textNormal}>{t('usernamePasswordLogin.password')}</Text>
					<InputField
						placeholder={t('usernamePasswordLogin.password')}
						onChangeText={setPassword}
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

export default UsernamePasswordLoginScreen;
