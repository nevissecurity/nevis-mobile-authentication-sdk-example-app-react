/**
 * Copyright © 2023 Nevis Security AG. All rights reserved.
 */

import i18next from 'i18next';

export enum OperationType {
	init,
	registration,
	authCloudApiRegistration,
	authentication,
	deregistration,
	deviceInformationChange,
	payloadDecode,
	pinChange,
	localData,
	unknown,
}

export class OperationTypeUtils {
	static localizedTitle(operationType: OperationType): string {
		switch (operationType) {
			case OperationType.init:
				return i18next.t('operation.init');
			case OperationType.registration:
				return i18next.t('operation.registration');
			case OperationType.authCloudApiRegistration:
				return i18next.t('operation.authCloudApiRegistration');
			case OperationType.authentication:
				return i18next.t('operation.authentication');
			case OperationType.deregistration:
				return i18next.t('operation.deregistration');
			case OperationType.deviceInformationChange:
				return i18next.t('operation.deviceInformationChange');
			case OperationType.payloadDecode:
				return i18next.t('operation.payloadDecode');
			case OperationType.pinChange:
				return i18next.t('operation.pinChange');
			case OperationType.localData:
				return i18next.t('operation.localData');
			case OperationType.unknown:
				return i18next.t('operation.unknown');
		}
	}
}
