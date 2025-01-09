/**
 * Copyright © 2023 Nevis Security AG. All rights reserved.
 */

import { StatusBar, useColorScheme, View } from 'react-native';

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import AuthCloudApiRegistrationScreen from './screens/AuthCloudApiRegistrationScreen';
import ConfirmationScreen from './screens/ConfirmationScreen';
import CredentialScreen from './screens/CredentialScreen';
import DeviceInformationChangeScreen from './screens/DeviceInformationChangeScreen';
import HomeScreen from './screens/HomeScreen';
import ReadQrCodeScreen from './screens/ReadQrCodeScreen';
import ResultScreen from './screens/ResultScreen';
import type { RootStackParamList } from './screens/RootStackParamList';
import SelectAccountScreen from './screens/SelectAccountScreen';
import SelectAuthenticatorScreen from './screens/SelectAuthenticatorScreen';
import TransactionConfirmationScreen from './screens/TransactionConfirmationScreen';
import UsernamePasswordLoginScreen from './screens/UsernamePasswordLoginScreen';
import { darkStyle, lightStyle } from './Styles';
import { navigationRef } from './utility/RootNavigation';

import './i18n/I18n';

const RootStack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
	const colorScheme = useColorScheme();
	const styles = colorScheme === 'dark' ? darkStyle : lightStyle;
	const statusBarColor = colorScheme === 'dark' ? 'black' : 'white';
	const statusBarStyle = colorScheme === 'dark' ? 'light-content' : 'dark-content';

	return (
		<View style={styles.container}>
			<StatusBar barStyle={statusBarStyle} backgroundColor={statusBarColor} />
			<NavigationContainer ref={navigationRef}>
				<RootStack.Navigator screenOptions={{ headerShown: false }}>
					<RootStack.Screen name="Home" component={HomeScreen} />
					<RootStack.Screen name="ReadQrCode" component={ReadQrCodeScreen} />
					<RootStack.Screen name="SelectAccount" component={SelectAccountScreen} />
					<RootStack.Screen
						name="AuthCloudApiRegistration"
						component={AuthCloudApiRegistrationScreen}
					/>
					<RootStack.Screen
						name="SelectAuthenticator"
						component={SelectAuthenticatorScreen}
					/>
					<RootStack.Screen name="Credential" component={CredentialScreen} />
					<RootStack.Screen
						name="DeviceInformationChange"
						component={DeviceInformationChangeScreen}
					/>
					<RootStack.Screen
						name="UsernamePasswordLogin"
						component={UsernamePasswordLoginScreen}
					/>
					<RootStack.Screen
						name="TransactionConfirmation"
						component={TransactionConfirmationScreen}
					/>
					<RootStack.Screen name="Confirmation" component={ConfirmationScreen} />
					<RootStack.Screen name="Result" component={ResultScreen} />
				</RootStack.Navigator>
			</NavigationContainer>
		</View>
	);
}
