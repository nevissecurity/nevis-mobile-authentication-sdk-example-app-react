/**
 * Copyright © 2023 Nevis Security AG. All rights reserved.
 */

import { useCallback } from 'react';
import { ScrollView, Text, useColorScheme, View } from 'react-native';

import { type NativeStackScreenProps } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import useDeviceInformationChangeViewModel from './DeviceInformationChangeViewModel';
import { type RootStackParamList } from './RootStackParamList';
import InputField from '../components/InputField';
import OutlinedButton from '../components/OutlinedButton';
import { darkStyle, lightStyle } from '../Styles';

type Props = NativeStackScreenProps<RootStackParamList, 'DeviceInformationChange'>;

const DeviceInformationChangeScreen = ({ route }: Props) => {
	const { setDeviceName, confirm, cancel } = useDeviceInformationChangeViewModel();

	const { t } = useTranslation();
	const colorScheme = useColorScheme();
	const styles = colorScheme === 'dark' ? darkStyle : lightStyle;
	const insets = useSafeAreaInsets();

	const onCancel = useCallback(async () => {
		await cancel();
	}, []);

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
					{t('deviceInformationChange.title')}
				</Text>
			</View>
			<View style={styles.middleContainer}>
				<Text style={[styles.textForeground, styles.textNormal]}>{route.params.name}</Text>
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
	);
};

export default DeviceInformationChangeScreen;
