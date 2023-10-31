/**
 * Copyright © 2023 Nevis Security AG. All rights reserved.
 */

import React from 'react';
import { Text, TouchableOpacity } from 'react-native';

import { useDynamicValue } from 'react-native-dynamic';

import { dynamicStyles } from '../Styles';

function CloseButton({ onPress }: { onPress: () => void }) {
	const styles = useDynamicValue(dynamicStyles);
	return (
		<TouchableOpacity style={styles.closeButton} onPress={onPress}>
			<Text style={styles.textTitle}>X</Text>
		</TouchableOpacity>
	);
}

export default React.memo(CloseButton);
