/**
 * Copyright © 2023 Nevis Security AG. All rights reserved.
 */

import React, { useCallback } from 'react';
import { SafeAreaView, ScrollView, Text, View } from 'react-native';

import { type NativeStackScreenProps } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import { useDynamicValue } from 'react-native-dynamic';

import useResultViewModel from './ResultViewModel';
import { type RootStackParamList } from './RootStackParamList';
import OutlinedButton from '../components/OutlinedButton';
import { OperationTypeUtils } from '../model/OperationType';
import { dynamicStyles } from '../Styles';

type Props = NativeStackScreenProps<RootStackParamList, 'Result'>;

const ResultScreen = ({ route }: Props) => {
	const { confirm } = useResultViewModel();

	const { t } = useTranslation();
	const styles = useDynamicValue(dynamicStyles);

	const onConfirm = useCallback(async () => {
		confirm();
	}, []);

	const resolvedOperation = OperationTypeUtils.localizedTitle(route.params.operation);
	const errorDescription = route.params.errorDescription;
	const errorCause = route.params.errorCause;
	return (
		<SafeAreaView style={styles.container}>
			<ScrollView contentContainerStyle={styles.container}>
				<View style={styles.titleContainer} />
				<View style={styles.middleContainer}>
					<Text style={styles.textTitle}>
						{errorDescription || errorCause
							? t('operation.failed.title', { operation: resolvedOperation })
							: t('operation.success.title', { operation: resolvedOperation })}
					</Text>
					{errorDescription && (
						<Text style={[styles.textError, styles.textCenter]}>
							{errorDescription}
						</Text>
					)}
					{errorCause && (
						<Text style={[styles.textError, styles.textCenter]}>{errorCause}</Text>
					)}
				</View>
				<View style={styles.bottomContainer}>
					<OutlinedButton text={t('confirmButtonTitle')} onPress={onConfirm} />
				</View>
			</ScrollView>
		</SafeAreaView>
	);
};

export default ResultScreen;
