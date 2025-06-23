/**
 * Copyright © 2025 Nevis Security AG. All rights reserved.
 */

import { memo } from 'react';
import { Text, useColorScheme, View } from 'react-native';

import AntDesign from '@react-native-vector-icons/ant-design';

import { darkStyle, lightStyle } from '../Styles.tsx';

type Props = {
	title: string;
	isSupported: boolean;
};

const AttestationModeListTile = ({ title, isSupported }: Props) => {
	const colorScheme = useColorScheme();
	const styles = colorScheme === 'dark' ? darkStyle : lightStyle;

	const iconName = isSupported ? 'check' : 'close';
	const color = isSupported ? styles.textSuccess.color : styles.textError.color;

	return (
		<View style={styles.listRow}>
			<AntDesign name={iconName} color={color} size={17} />
			<Text style={styles.textInfo}>{title}</Text>
		</View>
	);
};

export default memo(AttestationModeListTile);
