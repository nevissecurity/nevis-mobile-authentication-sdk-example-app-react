/**
 * Copyright © 2023 Nevis Security AG. All rights reserved.
 */

import React from 'react';
import { Text, TouchableOpacity } from 'react-native';

import { useDynamicValue } from 'react-native-dynamic';

import { dynamicStyles } from '../Styles';

function OutlinedButton({ text, onPress }: { text: string; onPress: () => void }) {
	const styles = useDynamicValue(dynamicStyles);
	return (
		<TouchableOpacity style={styles.roundedButton} onPress={onPress}>
			<Text style={styles.textNormal}>{text}</Text>
		</TouchableOpacity>
	);
}

export default React.memo(OutlinedButton);
