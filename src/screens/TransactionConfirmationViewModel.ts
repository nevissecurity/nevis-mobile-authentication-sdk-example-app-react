/**
 * Copyright © 2023 Nevis Security AG. All rights reserved.
 */

import { AccountSelectionHandler } from '@nevis-security/nevis-mobile-authentication-sdk-react';

const useTransactionConfirmationViewModel = () => {
	async function confirm(
		selectedUsername: string,
		accountSelectionHandler?: AccountSelectionHandler
	) {
		await accountSelectionHandler?.username(selectedUsername);
	}

	async function cancel(accountSelectionHandler?: AccountSelectionHandler) {
		await accountSelectionHandler?.cancel();
	}

	return {
		confirm,
		cancel,
	};
};

export default useTransactionConfirmationViewModel;
