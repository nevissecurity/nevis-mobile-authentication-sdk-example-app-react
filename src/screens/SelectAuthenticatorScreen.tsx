/**
 * Copyright © 2023 Nevis Security AG. All rights reserved.
 */

import { FlatList, SafeAreaView, Text, TouchableOpacity, useColorScheme, View } from 'react-native';

import { type NativeStackScreenProps } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';

import { type RootStackParamList } from './RootStackParamList';
import useSelectAuthenticatorViewModel from './SelectAuthenticatorViewModel';
import { AuthenticatorItemUtils } from '../model/AuthenticatorItem';
import { darkStyle, lightStyle } from '../Styles';
import { AuthenticatorUtils } from '../utility/AuthenticatorUtils';

type Props = NativeStackScreenProps<RootStackParamList, 'SelectAuthenticator'>;

type SelectAuthenticatorItemData = {
	aaid: string;
	title: string;
	isEnabled: boolean;
	details?: string;
};

type SelectAuthenticatorItemProps = {
	item: SelectAuthenticatorItemData;
	onPress: () => void;
};

const SelectAuthenticatorListItem = ({
	title,
	details,
	onPress,
}: {
	title: string;
	details?: string;
	onPress: () => void;
}) => {
	const colorScheme = useColorScheme();
	const styles = colorScheme === 'dark' ? darkStyle : lightStyle;
	return (
		<TouchableOpacity style={styles.listContainer} onPress={onPress}>
			<Text style={[styles.textForeground, styles.textNormal]}>{title}</Text>
			{details && <Text style={[styles.textForeground, styles.textDetail]}>{details}</Text>}
		</TouchableOpacity>
	);
};

const SelectAuthenticatorItem = ({ item, onPress }: SelectAuthenticatorItemProps) => (
	<SelectAuthenticatorListItem title={item.title} details={item.details} onPress={onPress} />
);

const SelectAuthenticatorScreen = ({ route }: Props) => {
	const { select } = useSelectAuthenticatorViewModel();

	const { t } = useTranslation();
	const colorScheme = useColorScheme();
	const styles = colorScheme === 'dark' ? darkStyle : lightStyle;

	function getItems() {
		return route.params.items.map((item) => {
			return {
				aaid: item.authenticator.aaid,
				title: AuthenticatorUtils.localizedTitle(item.authenticator),
				isEnabled: item.isEnabled,
				details: AuthenticatorItemUtils.localizedDetails(item),
			};
		});
	}

	const renderSeparator = () => <View style={styles.horizontalHairline} />;

	const renderItem = ({ item }: { item: SelectAuthenticatorItemData }) => {
		return (
			<SelectAuthenticatorItem
				item={item}
				onPress={() => select(item.aaid, route.params.handler)}
			/>
		);
	};

	return (
		<SafeAreaView style={styles.container}>
			<View style={styles.titleContainer}>
				<Text style={[styles.textForeground, styles.textTitle]}>
					{t('selectAuthenticator.title')}
				</Text>
				<FlatList
					data={getItems()}
					ItemSeparatorComponent={renderSeparator}
					renderItem={renderItem}
					keyExtractor={(item) => item.aaid}
				/>
			</View>
		</SafeAreaView>
	);
};

export default SelectAuthenticatorScreen;
