/**
 * Copyright © 2023 Nevis Security AG. All rights reserved.
 */

import { memo } from 'react';
import { Text, TouchableOpacity, useColorScheme } from 'react-native';

import { darkStyle, lightStyle } from '../Styles';

function CloseButton({ onPress }: { onPress: () => void }) {
	const colorScheme = useColorScheme();
	const styles = colorScheme === 'dark' ? darkStyle : lightStyle;
	return (
		<TouchableOpacity style={styles.closeButton} onPress={onPress}>
			<Text style={[styles.textForeground, styles.textTitle]}>X</Text>
		</TouchableOpacity>
	);
}

export default memo(CloseButton);
