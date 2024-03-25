/**
 * Copyright © 2024 Nevis Security AG. All rights reserved.
 */

import { useCallback } from 'react';
import { BackHandler, ScrollView, Text, useColorScheme, View } from 'react-native';

import { useFocusEffect } from '@react-navigation/native';
import { type NativeStackScreenProps } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import useConfirmationViewModel from './ConfirmationViewModel';
import { type RootStackParamList } from './RootStackParamList';
import OutlinedButton from '../components/OutlinedButton';
import { darkStyle, lightStyle } from '../Styles';

type Props = NativeStackScreenProps<RootStackParamList, 'Confirmation'>;

const ConfirmationScreen = ({ route }: Props) => {
	const { isFingerPrintVerification, confirm, cancel } = useConfirmationViewModel();

	const { t } = useTranslation();
	const colorScheme = useColorScheme();
	const styles = colorScheme === 'dark' ? darkStyle : lightStyle;
	const insets = useSafeAreaInsets();

	useFocusEffect(
		useCallback(() => {
			const onBackPress = () => {
				cancel(route.params.handler);
				return true;
			};

			const subscription = BackHandler.addEventListener('hardwareBackPress', onBackPress);

			return () => subscription.remove();
		}, [route.params.handler])
	);

	const onConfirm = useCallback(async () => {
		await confirm(route.params.handler);
	}, [route.params.handler]);

	const onCancel = useCallback(async () => {
		await cancel(route.params.handler);
	}, [route.params.handler]);

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
				<View style={styles.titleContainer} />
				<View style={styles.middleContainer}>
					<Text style={[styles.textForeground, styles.textTitle]}>
						{t('confirmation.description', {
							authenticator: route.params.authenticator,
						})}
					</Text>
					{isFingerPrintVerification && (
						<Text style={[styles.textNormal, styles.textCenter]}>
							{t('confirmation.description_fingerprint_verification')}
						</Text>
					)}
				</View>
				<View style={styles.bottomContainer}>
					<OutlinedButton text={t('confirmButtonTitle')} onPress={onConfirm} />
					<OutlinedButton text={t('cancelButtonTitle')} onPress={onCancel} />
				</View>
			</ScrollView>
		</View>
	);
};

export default ConfirmationScreen;
