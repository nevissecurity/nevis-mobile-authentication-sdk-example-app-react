/**
 * Copyright © 2024 Nevis Security AG. All rights reserved.
 */

import { useCallback, useRef } from 'react';
import {
	AppState,
	AppStateStatus,
	BackHandler,
	ScrollView,
	Text,
	useColorScheme,
	View,
} from 'react-native';

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
	const { isFingerPrintVerification, onPause, onResume, confirm, cancel } =
		useConfirmationViewModel();

	const { t } = useTranslation();
	const colorScheme = useColorScheme();
	const styles = colorScheme === 'dark' ? darkStyle : lightStyle;
	const insets = useSafeAreaInsets();
	const appState = useRef(AppState.currentState);

	function subscribeToBackPress() {
		const onBackPress = () => {
			cancel(route.params.handler);
			return true;
		};

		return BackHandler.addEventListener('hardwareBackPress', onBackPress);
	}

	function subscribeToAppStateChange() {
		const onStateChange = async (nextAppState: AppStateStatus) => {
			console.log(`New app state is ${nextAppState}`);
			if (appState.current.match(/inactive|background/) && nextAppState === 'active') {
				console.log('App has come to the foreground!');
				await onResume();
			} else if (appState.current === 'active' && nextAppState.match(/inactive|background/)) {
				console.log('App will enter to the background!');
				await onPause();
			}

			appState.current = nextAppState;
		};

		return AppState.addEventListener('change', onStateChange);
	}

	useFocusEffect(
		useCallback(() => {
			const backSubscription = subscribeToBackPress();
			const stateSubscription = subscribeToAppStateChange();

			return () => {
				backSubscription.remove();
				stateSubscription.remove();
			};
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
							{t('confirmation.fingerprintVerification')}
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
