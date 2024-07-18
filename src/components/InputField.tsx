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
	secureTextEntry,
}: {
	readonly placeholder: string;
	readonly onChangeText: (text: string) => void;
	readonly keyboardType?: KeyboardTypeOptions;
	readonly secureTextEntry?: boolean;
}) {
	const colorScheme = useColorScheme();
	const styles = colorScheme === 'dark' ? darkStyle : lightStyle;
	const placeholderTextColor = colorScheme === 'dark' ? '#ffffff9e' : '#0000005f';
	return (
		<TextInput
			style={[styles.input, styles.inputField]}
			autoCorrect={false}
			keyboardType={keyboardType ?? 'default'}
			onChangeText={onChangeText}
			placeholder={placeholder}
			secureTextEntry={secureTextEntry}
			placeholderTextColor={placeholderTextColor}
		/>
	);
}

export default memo(InputField);
