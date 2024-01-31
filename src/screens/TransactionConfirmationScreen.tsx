/**
 * Copyright © 2023 Nevis Security AG. All rights reserved.
 */

import { useCallback } from 'react';
import { Text, useColorScheme, View } from 'react-native';

import { type NativeStackScreenProps } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { type RootStackParamList } from './RootStackParamList';
import useTransactionConfirmationViewModel from './TransactionConfirmationViewModel';
import OutlinedButton from '../components/OutlinedButton';
import { darkStyle, lightStyle } from '../Styles';

type Props = NativeStackScreenProps<RootStackParamList, 'TransactionConfirmation'>;

const TransactionConfirmationScreen = ({ route }: Props) => {
	const { confirm, cancel } = useTransactionConfirmationViewModel();

	const { t } = useTranslation();
	const colorScheme = useColorScheme();
	const styles = colorScheme === 'dark' ? darkStyle : lightStyle;
	const insets = useSafeAreaInsets();

	const onConfirm = useCallback(async () => {
		await confirm(route.params.selectedUsername, route.params.accountSelectionHandler);
	}, [route.params.selectedUsername, route.params.accountSelectionHandler]);

	const onCancel = useCallback(async () => {
		await cancel(route.params.accountSelectionHandler);
	}, [route.params.accountSelectionHandler]);

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
			<View style={styles.titleContainer}>
				<Text style={[styles.textForeground, styles.textTitle]}>
					{t('transactionConfirmation.title')}
				</Text>
				<Text style={[styles.textForeground, styles.textNormal, styles.textCenter]}>
					{route.params.transactionConfirmationData}
				</Text>
			</View>
			<View style={styles.bottomContainer}>
				<OutlinedButton text={t('confirmButtonTitle')} onPress={onConfirm} />
				<OutlinedButton text={t('cancelButtonTitle')} onPress={onCancel} />
			</View>
		</View>
	);
};

export default TransactionConfirmationScreen;
