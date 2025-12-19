/**
 * Copyright © 2025 Nevis Security AG. All rights reserved.
 */

import { memo } from 'react';
import { Text, useColorScheme, View } from 'react-native';

import { useTranslation } from 'react-i18next';

import AttestationModeListTile from './AttestationModeListTile.tsx';
import { SdkAttestationInformation } from '../model/SdkAttestationInformation.ts';
import { darkStyle, lightStyle } from '../Styles.tsx';

type Props = {
	attestationInformation: SdkAttestationInformation;
};

const AttestationInformationSection = ({ attestationInformation }: Props) => {
	const { t } = useTranslation();
	const colorScheme = useColorScheme();
	const styles = colorScheme === 'dark' ? darkStyle : lightStyle;

	return (
		<View style={styles.sectionContainer}>
			<Text style={[styles.textForeground, styles.textNormal]}>
				{t('home.supportedAttestation')}
			</Text>
			<AttestationModeListTile
				title={t('home.surrogateBasic')}
				isSupported={
					attestationInformation.onlySurrogateBasic ||
					attestationInformation.onlyDefault ||
					attestationInformation.strict ||
					attestationInformation.strictStrongBox
				}
			/>
			<AttestationModeListTile
				title={t('home.fullBasicDefault')}
				isSupported={
					attestationInformation.onlyDefault ||
					attestationInformation.strict ||
					attestationInformation.strictStrongBox
				}
			/>
			<AttestationModeListTile
				title={t('home.basicStrict')}
				isSupported={
					attestationInformation.strict || attestationInformation.strictStrongBox
				}
			/>
			<AttestationModeListTile
				title={t('home.strictStrongBox')}
				isSupported={attestationInformation.strictStrongBox}
			/>
		</View>
	);
};

export default memo(AttestationInformationSection);
