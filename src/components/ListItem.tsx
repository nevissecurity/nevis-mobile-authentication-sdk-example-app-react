/**
 * Copyright © 2025 Nevis Security AG. All rights reserved.
 */

import { memo } from 'react';
import { Text, TouchableOpacity, useColorScheme } from 'react-native';

import debounce from 'debounce';

import { darkStyle, lightStyle } from '../Styles';
import Constants from '../utility/Constants';

function ListItem({
	title,
	details,
	onPress,
}: {
	title: string;
	details?: string;
	onPress: () => void;
}) {
	const colorScheme = useColorScheme();
	const styles = colorScheme === 'dark' ? darkStyle : lightStyle;
	return (
		<TouchableOpacity
			style={styles.listContainer}
			onPress={debounce(onPress, Constants.bounceRate, { immediate: true })}
		>
			<Text style={[styles.textForeground, styles.textNormal]}>{title}</Text>
			{details && <Text style={[styles.textForeground, styles.textDetail]}>{details}</Text>}
		</TouchableOpacity>
	);
}

export default memo(ListItem);
