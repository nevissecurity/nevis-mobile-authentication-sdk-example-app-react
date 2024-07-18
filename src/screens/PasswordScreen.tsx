/**
 * Copyright © 2024 Nevis Security AG. All rights reserved.
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

import {
	PasswordAuthenticatorProtectionStatus,
	PasswordProtectionStatusLastAttemptFailed,
	PasswordProtectionStatusLockedOut,
	PasswordProtectionStatusUnlocked,
	RecoverableError,
} from '@nevis-security/nevis-mobile-authentication-sdk-react';
import { useFocusEffect } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import usePasswordViewModel from './PasswordViewModel';
import { RootStackParamList } from './RootStackParamList';
import InputField from '../components/InputField';
import OutlinedButton from '../components/OutlinedButton';
import { PasswordMode } from '../model/PasswordMode';
import { darkStyle, lightStyle } from '../Styles';

type Props = NativeStackScreenProps<RootStackParamList, 'Password'>;

const PasswordScreen = ({ route }: Props) => {
	const { setOldPassword, setPassword, confirm, cancel } = usePasswordViewModel();

	const { t } = useTranslation();
	const colorScheme = useColorScheme();
	const styles = colorScheme === 'dark' ? darkStyle : lightStyle;
	const insets = useSafeAreaInsets();

	useFocusEffect(
		useCallback(() => {
			const onBackPress = () => {
				cancel(route.params.mode, route.params.handler);
				return true;
			};

			const subscription = BackHandler.addEventListener('hardwareBackPress', onBackPress);

			return () => subscription.remove();
		}, [route.params.mode, route.params.handler])
	);

	function title(passwordMode: PasswordMode): string {
		switch (passwordMode) {
			case PasswordMode.enrollment:
				return t('password.enrollment.title');
			case PasswordMode.verification:
				return t('password.verification.title');
			case PasswordMode.credentialChange:
				return t('password.change.title');
		}
	}

	function description(passwordMode: PasswordMode): string {
		switch (passwordMode) {
			case PasswordMode.enrollment:
				return t('password.enrollment.description');
			case PasswordMode.verification:
				return t('password.verification.description');
			case PasswordMode.credentialChange:
				return t('password.change.description');
		}
	}

	function errorText(recoverableError: RecoverableError): string {
		let text = recoverableError.description;
		if (recoverableError.cause) {
			text += ` ${recoverableError.cause}`;
		}

		return text;
	}

	function authenticatorProtectionText(status?: PasswordAuthenticatorProtectionStatus): string {
		if (status instanceof PasswordProtectionStatusLastAttemptFailed) {
			const remainingRetries = status.remainingRetries;
			const coolDownTimeInSec = status.coolDownTimeInSec;
			// NOTE: if coolDownTimeInSec is not zero, a countdown timer should be started.
			return t('password.passwordProtectionStatusDescriptionUnlocked', {
				remainingRetries: remainingRetries,
				coolDown: coolDownTimeInSec,
			});
		} else if (status instanceof PasswordProtectionStatusLockedOut) {
			return t('password.passwordProtectionStatusDescriptionLocked');
		}
		return '';
	}

	const onConfirm = async () => {
		await confirm(route.params.mode, route.params.handler);
	};

	const onCancel = useCallback(async () => {
		await cancel(route.params.mode, route.params.handler);
	}, [route.params.mode, route.params.handler]);

	const isChange = route.params.mode === PasswordMode.credentialChange;
	const lastRecoverableError = route.params.lastRecoverableError;
	const authenticatorProtectionStatus = route.params.authenticatorProtectionStatus;
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
							{title(route.params.mode)}
						</Text>
					</View>
					<View style={styles.middleContainer}>
						<Text style={[styles.textForeground, styles.textNormal]}>
							{description(route.params.mode)}
						</Text>
						{isChange && (
							<InputField
								placeholder={t('password.placeholder.oldPassword')}
								onChangeText={setOldPassword}
								secureTextEntry={true}
							/>
						)}
						<InputField
							placeholder={t('password.placeholder.password')}
							onChangeText={setPassword}
							secureTextEntry={route.params.mode !== PasswordMode.enrollment}
						/>
						{lastRecoverableError && (
							<Text style={[styles.textError, styles.textNormal, styles.textCenter]}>
								{errorText(lastRecoverableError)}
							</Text>
						)}
						{authenticatorProtectionStatus &&
							!(
								authenticatorProtectionStatus instanceof
								PasswordProtectionStatusUnlocked
							) && (
								<Text
									style={[styles.textError, styles.textNormal, styles.textCenter]}
								>
									{authenticatorProtectionText(authenticatorProtectionStatus)}
								</Text>
							)}
					</View>
					<View style={styles.bottomContainer}>
						<OutlinedButton text={t('confirmButtonTitle')} onPress={onConfirm} />
						<OutlinedButton text={t('cancelButtonTitle')} onPress={onCancel} />
					</View>
				</ScrollView>
			</KeyboardAvoidingView>
		</View>
	);
};

export default PasswordScreen;
