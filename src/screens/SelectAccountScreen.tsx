/**
 * Copyright © 2023 Nevis Security AG. All rights reserved.
 */
import { FlatList, Text, TouchableOpacity, useColorScheme, View } from 'react-native';

import { type NativeStackScreenProps } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { type RootStackParamList } from './RootStackParamList';
import useSelectAccountViewModel from './SelectAccountViewModel';
import { darkStyle, lightStyle } from '../Styles';

type Props = NativeStackScreenProps<RootStackParamList, 'SelectAccount'>;

type SelectAccountItemData = {
	username: string;
};

type SelectAccountItemProps = {
	item: SelectAccountItemData;
	onPress: () => void;
};

const SelectAccountListItem = ({ title, onPress }: { title: string; onPress: () => void }) => {
	const colorScheme = useColorScheme();
	const styles = colorScheme === 'dark' ? darkStyle : lightStyle;
	return (
		<TouchableOpacity style={styles.listContainer} onPress={onPress}>
			<Text style={[styles.textForeground, styles.textNormal]}>{title}</Text>
		</TouchableOpacity>
	);
};

const SelectAccountItem = ({ item, onPress }: SelectAccountItemProps) => (
	<SelectAccountListItem title={item.username} onPress={onPress} />
);

const SelectAccountScreen = ({ route }: Props) => {
	const { select } = useSelectAccountViewModel();

	const { t } = useTranslation();
	const colorScheme = useColorScheme();
	const styles = colorScheme === 'dark' ? darkStyle : lightStyle;
	const insets = useSafeAreaInsets();

	function getItems() {
		return route.params.items.map((item) => {
			return {
				username: item.username,
			};
		});
	}

	const renderSeparator = () => <View style={styles.horizontalHairline} />;

	const renderItem = ({ item }: { item: SelectAccountItemData }) => {
		return (
			<SelectAccountItem
				item={item}
				onPress={() =>
					select(
						item.username,
						route.params.operation,
						route.params.transactionConfirmationData,
						route.params.handler
					)
				}
			/>
		);
	};

	return (
		<View
			style={[
				styles.container,
				{
					paddingTop: insets.top,
					paddingBottom: insets.bottom,
					paddingLeft: insets.left,
					paddingRight: insets.right,
				},
			]}
		>
			<View style={styles.titleContainer}>
				<Text style={[styles.textForeground, styles.textTitle]}>
					{t('selectAccount.title')}
				</Text>
				<FlatList
					data={getItems()}
					ItemSeparatorComponent={renderSeparator}
					renderItem={renderItem}
					keyExtractor={(item) => item.username}
				/>
			</View>
		</View>
	);
};

export default SelectAccountScreen;
