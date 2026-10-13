/**
 * Copyright © 2023-2026 Nevis Security AG. All rights reserved.
 */

export enum OperationType {
	init,
	registration,
	authCloudApiRegistration,
	authentication,
	deregistration,
	deviceInformationChange,
	payloadDecode,
	pendingOutOfBandOperations,
	pinChange,
	passwordChange,
	localData,
	unknown,
}
