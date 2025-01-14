/**
 * Copyright © 2025 Nevis Security AG. All rights reserved.
 */

import { useCallback } from 'react';
import {
	BackHandler,
	KeyboardAvoidingView,
	type KeyboardTypeOptions,
	Platform,
	ScrollView,
	Text,
	useColorScheme,
	View,
} from 'react-native';

import {
	PasswordProtectionStatusLastAttemptFailed,
	PasswordProtectionStatusLockedOut,
	PinProtectionStatusLastAttemptFailed,
	PinProtectionStatusLockedOut,
	RecoverableError,
} from '@nevis-security/nevis-mobile-authentication-sdk-react';
import { useFocusEffect } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import type { RootStackParamList } from './RootStackParamList';
import { darkStyle, lightStyle } from '../Styles';
import useCredentialViewModel from './CredentialViewModel';
import InputField from '../components/InputField';
import OutlinedButton from '../components/OutlinedButton';
import { CredentialKind } from '../model/CredentialKind';
import { CredentialMode } from '../model/CredentialMode';

type Props = NativeStackScreenProps<RootStackParamList, 'Credential'>;

type ScreenMetadata = {
	title: string;
	description: string;
};

type FieldMetadata = {
	credentialPlaceholder: string;
	oldCredentialPlaceholder: string;
	keyboardType: KeyboardTypeOptions;
};

const CredentialScreen = ({ route }: Props) => {
	const { setOldCredential, setCredential, confirm, cancel } = useCredentialViewModel();

	const { t } = useTranslation();
	const colorScheme = useColorScheme();
	const styles = colorScheme === 'dark' ? darkStyle : lightStyle;
	const insets = useSafeAreaInsets();

	useFocusEffect(
		useCallback(() => {
			const onBackPress = () => {
				cancel(route.params.mode, route.params.kind, route.params.handler);
				return true;
			};

			const subscription = BackHandler.addEventListener('hardwareBackPress', onBackPress);

			return () => subscription.remove();
		}, [route.params.mode, route.params.kind, route.params.handler])
	);

	const screenMetadata: Record<CredentialMode, Record<CredentialKind, ScreenMetadata>> = {
		[CredentialMode.enrollment]: {
			[CredentialKind.pin]: {
				title: t('pin.enrollment.title'),
				description: t('pin.enrollment.description'),
			},
			[CredentialKind.password]: {
				title: t('password.enrollment.title'),
				description: t('password.enrollment.description'),
			},
		},
		[CredentialMode.verification]: {
			[CredentialKind.pin]: {
				title: t('pin.verification.title'),
				description: t('pin.verification.description'),
			},
			[CredentialKind.password]: {
				title: t('password.verification.title'),
				description: t('password.verification.description'),
			},
		},
		[CredentialMode.change]: {
			[CredentialKind.pin]: {
				title: t('pin.change.title'),
				description: t('pin.change.description'),
			},
			[CredentialKind.password]: {
				title: t('password.change.title'),
				description: t('password.change.description'),
			},
		},
	};

	const fieldMetadata: Record<CredentialKind, FieldMetadata> = {
		[CredentialKind.pin]: {
			credentialPlaceholder: t('pin.placeholder.pin'),
			oldCredentialPlaceholder: t('pin.placeholder.oldPin'),
			keyboardType: 'numeric',
		},
		[CredentialKind.password]: {
			credentialPlaceholder: t('password.placeholder.password'),
			oldCredentialPlaceholder: t('password.placeholder.oldPassword'),
			keyboardType: 'default',
		},
	};

	function title(): string {
		const kinds = screenMetadata[route.params.mode];
		return kinds[route.params.kind].title;
	}

	function description(): string {
		const kinds = screenMetadata[route.params.mode];
		return kinds[route.params.kind].description;
	}

	function errorText(recoverableError: RecoverableError): string {
		let text = recoverableError.description;
		if (recoverableError.cause) {
			text += ` ${recoverableError.cause}`;
		}

		return text;
	}

	function protectionStatusText(): string | undefined {
		const pinProtectionStatus = route.params.pinProtectionStatus;
		if (pinProtectionStatus instanceof PinProtectionStatusLastAttemptFailed) {
			const remainingRetries = pinProtectionStatus.remainingRetries;
			const coolDownTimeInSec = pinProtectionStatus.coolDownTimeInSec;
			// NOTE: if coolDownTimeInSec is not zero, a countdown timer should be started.
			return t('pin.protectionStatus.lastAttemptFailed', {
				remainingRetries: remainingRetries,
				coolDown: coolDownTimeInSec,
			});
		} else if (pinProtectionStatus instanceof PinProtectionStatusLockedOut) {
			return t('pin.protectionStatus.locked');
		}

		const passwordProtectionStatus = route.params.passwordProtectionStatus;
		if (passwordProtectionStatus instanceof PasswordProtectionStatusLastAttemptFailed) {
			const remainingRetries = passwordProtectionStatus.remainingRetries;
			const coolDownTimeInSec = passwordProtectionStatus.coolDownTimeInSec;
			// NOTE: if `coolDownTimeInSec` is not zero, a countdown timer should be started.
			return t('password.protectionStatus.lastAttemptFailed', {
				remainingRetries: remainingRetries,
				coolDown: coolDownTimeInSec,
			});
		} else if (passwordProtectionStatus instanceof PasswordProtectionStatusLockedOut) {
			return t('password.protectionStatus.locked');
		}

		// In case of PinProtectionStatusUnlocked or PasswordProtectionStatusUnlocked
		// no need to show any kind of message
		return undefined;
	}

	const onConfirm = async () => {
		await confirm(route.params.mode, route.params.kind, route.params.handler);
	};

	const onCancel = useCallback(async () => {
		await cancel(route.params.mode, route.params.kind, route.params.handler);
	}, [route.params.mode, route.params.kind, route.params.handler]);

	const isChange = route.params.mode === CredentialMode.change;
	const oldCredentialPlaceholder = fieldMetadata[route.params.kind].oldCredentialPlaceholder;
	const credentialPlaceholder = fieldMetadata[route.params.kind].credentialPlaceholder;
	const keyboardType = fieldMetadata[route.params.kind].keyboardType;
	const lastRecoverableError = route.params.lastRecoverableError;
	const protectionStatus = protectionStatusText();
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
						<Text style={[styles.textForeground, styles.textTitle]}>{title()}</Text>
					</View>
					<View style={styles.middleContainer}>
						<Text style={[styles.textForeground, styles.textNormal]}>
							{description()}
						</Text>
						{isChange && (
							<InputField
								placeholder={oldCredentialPlaceholder}
								onChangeText={setOldCredential}
								keyboardType={keyboardType}
								secureTextEntry={true}
							/>
						)}
						<InputField
							placeholder={credentialPlaceholder}
							onChangeText={setCredential}
							keyboardType={keyboardType}
							secureTextEntry={true}
						/>
						{lastRecoverableError && (
							<Text style={[styles.textError, styles.textNormal, styles.textCenter]}>
								{errorText(lastRecoverableError)}
							</Text>
						)}
						{protectionStatus && (
							<Text style={[styles.textError, styles.textNormal, styles.textCenter]}>
								{protectionStatus}
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

export default CredentialScreen;
