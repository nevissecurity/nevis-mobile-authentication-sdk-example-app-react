/**
 * Copyright © 2023 Nevis Security AG. All rights reserved.
 */

import { DynamicStyleSheet, DynamicValue } from 'react-native-dynamic';

export const dynamicStyles = new DynamicStyleSheet({
	container: {
		backgroundColor: new DynamicValue('white', 'black'),
		flex: 1,
	},
	titleContainer: {
		flex: 1,
		rowGap: 32,
		padding: 16,
	},
	middleContainer: {
		flex: 2,
		justifyContent: 'center',
		rowGap: 16,
		padding: 16,
	},
	bottomContainer: {
		flex: 7,
		justifyContent: 'flex-end',
		rowGap: 16,
		padding: 16,
	},
	listContainer: {
		flex: 1,
		rowGap: 8,
		paddingTop: 16,
		paddingBottom: 16,
	},
	textTitle: {
		color: new DynamicValue('black', 'white'),
		textAlign: 'center',
		fontWeight: 'bold',
		fontSize: 22,
	},
	textNormal: {
		color: new DynamicValue('black', 'white'),
		fontSize: 17,
	},
	textDetail: {
		color: new DynamicValue('black', 'white'),
		fontSize: 14,
	},
	textInfo: {
		color: new DynamicValue('black', 'white'),
		fontSize: 12,
	},
	textCenter: {
		textAlign: 'center',
	},
	textError: {
		color: 'red',
		fontSize: 17,
	},
	closeButton: {
		alignItems: 'center',
		justifyContent: 'center',
		alignSelf: 'flex-end',
		marginRight: 5,
		marginTop: 5,
		height: 40,
		width: 40,
	},
	roundedButton: {
		color: new DynamicValue('black', 'white'),
		borderColor: new DynamicValue('black', 'white'),
		backgroundColor: new DynamicValue('white', 'black'),
		alignItems: 'center',
		justifyContent: 'center',
		borderRadius: 10,
		borderWidth: 1,
		height: 40,
	},
	input: {
		color: new DynamicValue('black', 'white'),
		borderColor: new DynamicValue('black', 'white'),
		backgroundColor: new DynamicValue('white', 'black'),
		paddingLeft: 16,
		borderRadius: 10,
		borderWidth: 1,
		height: 40,
	},
	horizontalHairline: {
		backgroundColor: new DynamicValue('white', 'black'),
		height: 0.5,
	},
	transparentTitleBar: {
		position: 'absolute',
		justifyContent: 'center',
		alignItems: 'center',
		top: 40,
		width: '100%',
		zIndex: 1,
	},
});
