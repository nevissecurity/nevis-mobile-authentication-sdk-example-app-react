/**
 * Copyright © 2023 Nevis Security AG. All rights reserved.
 */

import React, { useCallback } from 'react';
import { SafeAreaView, Text, View } from 'react-native';

import { type NativeStackScreenProps } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import { useDynamicValue } from 'react-native-dynamic';

import { type RootStackParamList } from './RootStackParamList';
import useTransactionConfirmationViewModel from './TransactionConfirmationViewModel';
import OutlinedButton from '../components/OutlinedButton';
import { dynamicStyles } from '../Styles';

type Props = NativeStackScreenProps<RootStackParamList, 'TransactionConfirmation'>;

const TransactionConfirmationScreen = ({ route }: Props) => {
	const { confirm, cancel } = useTransactionConfirmationViewModel();

	const { t } = useTranslation();
	const styles = useDynamicValue(dynamicStyles);

	const onConfirm = useCallback(async () => {
		await confirm(route.params.selectedUsername, route.params.accountSelectionHandler);
	}, []);

	const onCancel = useCallback(async () => {
		await cancel(route.params.accountSelectionHandler);
	}, []);

	return (
		<SafeAreaView style={styles.container}>
			<View style={styles.titleContainer}>
				<Text style={styles.textTitle}>{t('transactionConfirmation.title')}</Text>
				<Text style={[styles.textNormal, styles.textCenter]}>
					{route.params.transactionConfirmationData}
				</Text>
			</View>
			<View style={styles.bottomContainer}>
				<OutlinedButton text={t('confirmButtonTitle')} onPress={onConfirm} />
				<OutlinedButton text={t('cancelButtonTitle')} onPress={onCancel} />
			</View>
		</SafeAreaView>
	);
};

export default TransactionConfirmationScreen;
