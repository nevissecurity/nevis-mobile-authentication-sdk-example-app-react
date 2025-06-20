/**
 * Copyright © 2025 Nevis Security AG. All rights reserved.
 */

import { memo } from 'react';
import { Text, useColorScheme, View } from 'react-native';

import { useTranslation } from 'react-i18next';

import { SdkMetaData } from '../model/SdkMetaData.ts';
import { darkStyle, lightStyle } from '../Styles.tsx';

type Props = {
	metaData: SdkMetaData;
};

const MetaDataSection = ({ metaData }: Props) => {
	const { t } = useTranslation();
	const colorScheme = useColorScheme();
	const styles = colorScheme === 'dark' ? darkStyle : lightStyle;

	return (
		<View style={styles.sectionContainer}>
			<View style={styles.sectionContainerItem}>
				<Text style={[styles.textForeground, styles.textNormal]}>
					{t('home.nevisMobileAuthenticationSdk')}
				</Text>
				<Text style={[styles.textForeground, styles.textInfo]}>{metaData.version}</Text>
			</View>
			<View style={styles.sectionContainerItem}>
				<Text style={[styles.textForeground, styles.textNormal]}>{t('home.facetId')}</Text>
				<Text style={[styles.textForeground, styles.textInfo]}>{metaData.facetId}</Text>
			</View>
			{metaData.certificateFingerprint && (
				<View style={styles.sectionContainerItem}>
					<Text style={[styles.textForeground, styles.textNormal]}>
						{t('home.certificateFingerprint')}
					</Text>
					<Text style={[styles.textForeground, styles.textInfo]}>
						{metaData.certificateFingerprint}
					</Text>
				</View>
			)}
		</View>
	);
};

export default memo(MetaDataSection);
