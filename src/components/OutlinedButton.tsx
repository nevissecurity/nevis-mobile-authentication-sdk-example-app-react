/**
 * Copyright © 2023 Nevis Security AG. All rights reserved.
 */

import { memo } from 'react';
import { Text, TouchableOpacity, useColorScheme } from 'react-native';

import { darkStyle, lightStyle } from '../Styles';

function OutlinedButton({ text, onPress }: { text: string; onPress: () => void }) {
	const colorScheme = useColorScheme();
	const styles = colorScheme === 'dark' ? darkStyle : lightStyle;
	return (
		<TouchableOpacity style={[styles.input, styles.roundedButton]} onPress={onPress}>
			<Text style={[styles.textForeground, styles.textNormal]}>{text}</Text>
		</TouchableOpacity>
	);
}

export default memo(OutlinedButton);
