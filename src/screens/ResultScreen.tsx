/**
 * Copyright © 2023 Nevis Security AG. All rights reserved.
 */

import { useCallback } from 'react';
import { ScrollView, Text, useColorScheme, View } from 'react-native';

import { type NativeStackScreenProps } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import useResultViewModel from './ResultViewModel';
import { type RootStackParamList } from './RootStackParamList';
import OutlinedButton from '../components/OutlinedButton';
import { OperationTypeUtils } from '../model/OperationType';
import { darkStyle, lightStyle } from '../Styles';

type Props = NativeStackScreenProps<RootStackParamList, 'Result'>;

const ResultScreen = ({ route }: Props) => {
	const { confirm } = useResultViewModel();

	const { t } = useTranslation();
	const colorScheme = useColorScheme();
	const styles = colorScheme === 'dark' ? darkStyle : lightStyle;
	const insets = useSafeAreaInsets();

	const onConfirm = useCallback(async () => {
		confirm();
	}, []);

	const resolvedOperation = OperationTypeUtils.localizedTitle(route.params.operation);
	const errorDescription = route.params.errorDescription;
	const errorCause = route.params.errorCause;
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
						{errorDescription || errorCause
							? t('operation.failed.title', { operation: resolvedOperation })
							: t('operation.success.title', { operation: resolvedOperation })}
					</Text>
					{errorDescription && (
						<Text style={[styles.textError, styles.textNormal, styles.textCenter]}>
							{errorDescription}
						</Text>
					)}
					{errorCause && (
						<Text style={[styles.textError, styles.textNormal, styles.textCenter]}>
							{errorCause}
						</Text>
					)}
				</View>
				<View style={styles.bottomContainer}>
					<OutlinedButton text={t('confirmButtonTitle')} onPress={onConfirm} />
				</View>
			</ScrollView>
		</View>
	);
};

export default ResultScreen;
