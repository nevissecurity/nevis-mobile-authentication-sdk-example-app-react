/**
 * Copyright © 2023 Nevis Security AG. All rights reserved.
 */

import { useCallback } from 'react';
import { ScrollView, Text, useColorScheme, View } from 'react-native';

import {
	PinAuthenticatorProtectionStatus,
	PinProtectionStatusLastAttemptFailed,
	PinProtectionStatusLockedOut,
	PinProtectionStatusUnlocked,
} from '@nevis-security/nevis-mobile-authentication-sdk-react';
import { type NativeStackScreenProps } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import usePinViewModel from './PinViewModel';
import { type RootStackParamList } from './RootStackParamList';
import InputField from '../components/InputField';
import OutlinedButton from '../components/OutlinedButton';
import { PinMode } from '../model/PinMode';
import { darkStyle, lightStyle } from '../Styles';

type Props = NativeStackScreenProps<RootStackParamList, 'Pin'>;

const PinScreen = ({ route }: Props) => {
	const { setOldPin, setPin, confirm, cancel } = usePinViewModel();

	const { t } = useTranslation();
	const colorScheme = useColorScheme();
	const styles = colorScheme === 'dark' ? darkStyle : lightStyle;
	const insets = useSafeAreaInsets();

	function title(pinMode: PinMode): string {
		switch (pinMode) {
			case PinMode.enrollment:
				return t('pin.enrollment.title');
			case PinMode.verification:
				return t('pin.verification.title');
			case PinMode.credentialChange:
				return t('pin.change.title');
		}
	}

	function description(pinMode: PinMode): string {
		switch (pinMode) {
			case PinMode.enrollment:
				return t('pin.enrollment.description');
			case PinMode.verification:
				return t('pin.verification.description');
			case PinMode.credentialChange:
				return t('pin.change.description');
		}
	}

	function authenticatorProtectionText(status?: PinAuthenticatorProtectionStatus): string {
		if (status instanceof PinProtectionStatusLastAttemptFailed) {
			const remainingRetries = status.remainingRetries;
			const coolDownTimeInSec = status.coolDownTimeInSec;
			// NOTE: if coolDownTimeInSec is not zero, a countdown timer should be started.
			return t('pin.pinProtectionStatusDescriptionUnlocked', {
				remainingRetries: remainingRetries,
				coolDown: coolDownTimeInSec,
			});
		} else if (status instanceof PinProtectionStatusLockedOut) {
			return t('pin.pinProtectionStatusDescriptionLocked');
		}
		return '';
	}

	const onConfirm = async () => {
		await confirm(route.params.mode, route.params.handler);
	};

	const onCancel = useCallback(async () => {
		await cancel(route.params.mode, route.params.handler);
	}, [route.params.mode, route.params.handler]);

	const isChange = route.params.mode === PinMode.credentialChange;
	const lastRecoverableError = route.params.lastRecoverableError;
	const authenticatorProtectionStatus = route.params.authenticatorProtectionStatus;
	return (
		<ScrollView
			contentContainerStyle={styles.container}
			style={{
				paddingTop: insets.top,
				paddingBottom: insets.bottom,
				paddingLeft: insets.left,
				paddingRight: insets.right,
			}}
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
						placeholder={t('pin.placeholder.oldPin')}
						onChangeText={setOldPin}
						keyboardType={'numeric'}
					/>
				)}
				<InputField
					placeholder={t('pin.placeholder.pin')}
					onChangeText={setPin}
					keyboardType={'numeric'}
				/>
				{lastRecoverableError && (
					<Text style={[styles.textError, styles.textNormal, styles.textCenter]}>
						{lastRecoverableError.description}
					</Text>
				)}
				{authenticatorProtectionStatus &&
					!(authenticatorProtectionStatus instanceof PinProtectionStatusUnlocked) && (
						<Text style={[styles.textError, styles.textNormal, styles.textCenter]}>
							{authenticatorProtectionText(authenticatorProtectionStatus)}
						</Text>
					)}
			</View>
			<View style={styles.bottomContainer}>
				<OutlinedButton text={t('confirmButtonTitle')} onPress={onConfirm} />
				<OutlinedButton text={t('cancelButtonTitle')} onPress={onCancel} />
			</View>
		</ScrollView>
	);
};

export default PinScreen;
