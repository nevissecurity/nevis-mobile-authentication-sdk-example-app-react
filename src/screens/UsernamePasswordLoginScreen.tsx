/**
 * Copyright © 2023 Nevis Security AG. All rights reserved.
 */

import { useCallback } from 'react';
import {
	BackHandler,
	KeyboardAvoidingView,
	Platform,
	ScrollView,
	Text,
	useColorScheme,
	View,
} from 'react-native';

import { useFocusEffect } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import useUsernamePasswordLoginViewModel from './UsernamePasswordLoginViewModel';
import InputField from '../components/InputField';
import OutlinedButton from '../components/OutlinedButton';
import { darkStyle, lightStyle } from '../Styles';

const UsernamePasswordLoginScreen = () => {
	const { setUsername, setPassword, confirm, cancel } = useUsernamePasswordLoginViewModel();

	const { t } = useTranslation();
	const colorScheme = useColorScheme();
	const styles = colorScheme === 'dark' ? darkStyle : lightStyle;
	const insets = useSafeAreaInsets();

	useFocusEffect(
		useCallback(() => {
			const onBackPress = () => {
				cancel();
				return true;
			};

			const subscription = BackHandler.addEventListener('hardwareBackPress', onBackPress);

			return () => subscription.remove();
		}, [])
	);

	const onCancel = useCallback(async () => {
		cancel();
	}, []);

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
			<KeyboardAvoidingView
				behavior={Platform.OS === 'ios' ? 'height' : undefined}
				style={styles.container}
			>
				<ScrollView
					contentContainerStyle={styles.contentContainer}
					keyboardShouldPersistTaps={'handled'}
				>
					<View style={styles.titleContainer}>
						<Text style={[styles.textForeground, styles.textTitle]}>
							{t('usernamePasswordLogin.title')}
						</Text>
					</View>
					<View style={styles.middleContainer}>
						<Text style={[styles.textForeground, styles.textNormal]}>
							{t('usernamePasswordLogin.username')}
						</Text>
						<InputField
							placeholder={t('usernamePasswordLogin.username')}
							onChangeText={setUsername}
						/>
						<Text style={[styles.textForeground, styles.textNormal]}>
							{t('usernamePasswordLogin.password')}
						</Text>
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
			</KeyboardAvoidingView>
		</View>
	);
};

export default UsernamePasswordLoginScreen;
