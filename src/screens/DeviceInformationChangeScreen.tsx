/**
 * Copyright © 2023 Nevis Security AG. All rights reserved.
 */

import { useCallback } from 'react';
import { SafeAreaView, ScrollView, Text, useColorScheme, View } from 'react-native';

import { type NativeStackScreenProps } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';

import useDeviceInformationChangeViewModel from './DeviceInformationChangeViewModel';
import { type RootStackParamList } from './RootStackParamList';
import InputField from '../components/InputField';
import OutlinedButton from '../components/OutlinedButton';
import { darkStyle, lightStyle } from '../Styles';

type Props = NativeStackScreenProps<RootStackParamList, 'DeviceInformationChange'>;

const DeviceInformationChangeScreen = ({ route }: Props) => {
	const { setDeviceName, confirm, cancel } = useDeviceInformationChangeViewModel();

	const colorScheme = useColorScheme();
	const styles = colorScheme === 'dark' ? darkStyle : lightStyle;
	const { t } = useTranslation();

	const onCancel = useCallback(async () => {
		await cancel();
	}, []);

	return (
		<SafeAreaView style={styles.container}>
			<ScrollView contentContainerStyle={styles.container}>
				<View style={styles.titleContainer}>
					<Text style={[styles.textForeground, styles.textTitle]}>
						{t('deviceInformationChange.title')}
					</Text>
				</View>
				<View style={styles.middleContainer}>
					<Text style={[styles.textForeground, styles.textNormal]}>
						{route.params.name}
					</Text>
					<InputField
						placeholder={t('deviceInformationChange.newName')}
						onChangeText={setDeviceName}
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

export default DeviceInformationChangeScreen;
