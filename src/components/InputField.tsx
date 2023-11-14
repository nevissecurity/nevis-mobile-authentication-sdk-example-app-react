/**
 * Copyright © 2023 Nevis Security AG. All rights reserved.
 */

import { memo } from 'react';
import { type KeyboardTypeOptions, TextInput } from 'react-native';

import { useDynamicValue } from 'react-native-dynamic';

import { dynamicStyles } from '../Styles';

function InputField({
	placeholder,
	onChangeText,
	keyboardType,
}: {
	placeholder: string;
	onChangeText: (text: string) => void;
	keyboardType?: KeyboardTypeOptions;
}) {
	const styles = useDynamicValue(dynamicStyles);
	return (
		<TextInput
			style={styles.input}
			autoCorrect={false}
			keyboardType={keyboardType || 'default'}
			onChangeText={onChangeText}
			placeholder={placeholder}
		/>
	);
}

export default memo(InputField);
