/**
 * Copyright © 2023 Nevis Security AG. All rights reserved.
 */

import {
	CommonActions,
	createNavigationContainerRef,
	StackActions,
} from '@react-navigation/native';

export const navigationRef = createNavigationContainerRef<any>();

export function navigate(name: string, params: object) {
	if (navigationRef.isReady()) {
		const currentScreen = navigationRef.current?.getCurrentRoute();
		console.log(`Current screen is ${currentScreen?.name}.`);

		if (currentScreen?.name === name) {
			console.log(`Already on ${name} screen.`);
			const setParams = CommonActions.setParams(params);
			console.log('Updating screen params instead of navigation.');
			navigationRef.dispatch(setParams);
			return;
		}
		navigationRef.navigate(name, params);
	}
}

export function goToHome() {
	if (navigationRef.isReady()) {
		navigationRef.dispatch(StackActions.popToTop());
	}
}
