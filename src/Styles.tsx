/**
 * Copyright © 2023 Nevis Security AG. All rights reserved.
 */

import { StyleSheet, TextStyle, ViewStyle } from 'react-native';

const white = 'white';
const black = 'black';
const red = 'red';

const titleContainerStyle: ViewStyle = {
	flex: 1,
	rowGap: 32,
	padding: 16,
};

const middleContainerStyle: ViewStyle = {
	flex: 2,
	justifyContent: 'center',
	rowGap: 16,
	padding: 16,
};

const bottomContainerStyle: ViewStyle = {
	flex: 7,
	justifyContent: 'flex-end',
	rowGap: 16,
	padding: 16,
};

const listContainerStyle: ViewStyle = {
	flex: 1,
	rowGap: 8,
	paddingTop: 16,
	paddingBottom: 16,
};

const textTitleStyle: TextStyle = {
	textAlign: 'center',
	fontWeight: 'bold',
	fontSize: 22,
};

const textNormalStyle: TextStyle = {
	fontSize: 17,
};

const textDetailStyle: TextStyle = {
	fontSize: 14,
};

const textInfoStyle: TextStyle = {
	fontSize: 12,
};

const textCenterStyle: TextStyle = {
	textAlign: 'center',
};

const closeButtonStyle: ViewStyle = {
	alignItems: 'center',
	justifyContent: 'center',
	alignSelf: 'flex-end',
	marginRight: 5,
	marginTop: 5,
	height: 40,
	width: 40,
};

const roundedButtonStyle: ViewStyle = {
	alignItems: 'center',
	justifyContent: 'center',
	borderRadius: 10,
	borderWidth: 1,
	height: 40,
};

const inputFieldStyle: ViewStyle = {
	paddingLeft: 16,
	borderRadius: 10,
	borderWidth: 1,
	height: 40,
};

const transparentTitleBarStyle: ViewStyle = {
	position: 'absolute',
	justifyContent: 'center',
	alignItems: 'center',
	top: 40,
	width: '100%',
	zIndex: 1,
};

export const darkStyle = StyleSheet.create({
	container: {
		backgroundColor: black,
		flex: 1,
	},
	titleContainer: titleContainerStyle,
	middleContainer: middleContainerStyle,
	bottomContainer: bottomContainerStyle,
	listContainer: listContainerStyle,
	textForeground: {
		color: white,
	},
	textError: {
		color: red,
	},
	textTitle: textTitleStyle,
	textNormal: textNormalStyle,
	textDetail: textDetailStyle,
	textInfo: textInfoStyle,
	textCenter: textCenterStyle,
	closeButton: closeButtonStyle,
	input: {
		color: white,
		borderColor: white,
		backgroundColor: black,
	},
	roundedButton: roundedButtonStyle,
	inputField: inputFieldStyle,
	horizontalHairline: {
		backgroundColor: black,
		height: 0.5,
	},
	transparentTitleBar: transparentTitleBarStyle,
});

export const lightStyle = StyleSheet.create({
	container: {
		backgroundColor: white,
		flex: 1,
	},
	titleContainer: titleContainerStyle,
	middleContainer: middleContainerStyle,
	bottomContainer: bottomContainerStyle,
	listContainer: listContainerStyle,
	textForeground: {
		color: black,
	},
	textError: {
		color: red,
	},
	textTitle: textTitleStyle,
	textNormal: textNormalStyle,
	textDetail: textDetailStyle,
	textInfo: textInfoStyle,
	textCenter: textCenterStyle,
	closeButton: closeButtonStyle,
	input: {
		color: black,
		borderColor: black,
		backgroundColor: white,
	},
	roundedButton: roundedButtonStyle,
	inputField: inputFieldStyle,
	horizontalHairline: {
		backgroundColor: white,
		height: 0.5,
	},
	transparentTitleBar: transparentTitleBarStyle,
});
