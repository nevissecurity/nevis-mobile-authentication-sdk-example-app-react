/**
 * Copyright © 2023 Nevis Security AG. All rights reserved.
 */

import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import type { RootStackParamList } from './RootStackParamList';

const useResultViewModel = () => {
	const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

	function confirm() {
		navigation.popToTop();
	}

	return {
		confirm,
	};
};

export default useResultViewModel;
