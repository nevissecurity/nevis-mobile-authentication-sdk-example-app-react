/**
 * Copyright © 2023 Nevis Security AG. All rights reserved.
 */

import { memo } from 'react';
import { type KeyboardTypeOptions, TextInput, useColorScheme } from 'react-native';

import { darkStyle, lightStyle } from '../Styles';

function InputField({
	placeholder,
	onChangeText,
	keyboardType,
}: {
	placeholder: string;
	onChangeText: (text: string) => void;
	keyboardType?: KeyboardTypeOptions;
}) {
	const colorScheme = useColorScheme();
	const styles = colorScheme === 'dark' ? darkStyle : lightStyle;
	const placeholderTextColor = colorScheme === 'dark' ? '#ffffff9e' : '#0000005f';
	return (
		<TextInput
			style={[styles.input, styles.inputField]}
			autoCorrect={false}
			keyboardType={keyboardType || 'default'}
			onChangeText={onChangeText}
			placeholder={placeholder}
			placeholderTextColor={placeholderTextColor}
		/>
	);
}

export default memo(InputField);
