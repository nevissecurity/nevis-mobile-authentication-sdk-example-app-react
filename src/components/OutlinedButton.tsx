/**
 * Copyright © 2023 Nevis Security AG. All rights reserved.
 */

import { memo } from 'react';
import { Text, TouchableOpacity, useColorScheme } from 'react-native';

import debounce from 'debounce';

import { darkStyle, lightStyle } from '../Styles';
import Constants from '../utility/Constants';

function OutlinedButton({ text, onPress }: { text: string; onPress: () => void }) {
	const colorScheme = useColorScheme();
	const styles = colorScheme === 'dark' ? darkStyle : lightStyle;
	return (
		<TouchableOpacity
			style={[styles.input, styles.roundedButton]}
			onPress={debounce(onPress, Constants.bounceRate, { immediate: true })}
		>
			<Text style={[styles.textForeground, styles.textNormal]}>{text}</Text>
		</TouchableOpacity>
	);
}

export default memo(OutlinedButton);
