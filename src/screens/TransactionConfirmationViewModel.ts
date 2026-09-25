/**
 * Copyright © 2023 Nevis Security AG. All rights reserved.
 */

import { AccountSelectionHandler } from '@nevis-security/nevis-mobile-authentication-sdk-react';

import { ErrorHandler } from '../error/ErrorHandler.ts';
import { OperationType } from '../model/OperationType.ts';

const useTransactionConfirmationViewModel = () => {
	async function confirm(
		selectedUsername: string,
		accountSelectionHandler?: AccountSelectionHandler
	) {
		await accountSelectionHandler
			?.username(selectedUsername)
			.catch(ErrorHandler.handle.bind(null, OperationType.unknown));
	}

	async function cancel(accountSelectionHandler?: AccountSelectionHandler) {
		await accountSelectionHandler
			?.cancel()
			.catch(ErrorHandler.handle.bind(null, OperationType.unknown));
	}

	return {
		confirm,
		cancel,
	};
};

export default useTransactionConfirmationViewModel;
