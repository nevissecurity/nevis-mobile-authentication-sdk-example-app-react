/**
 * Copyright © 2023 Nevis Security AG. All rights reserved.
 */

import { AccountSelectionHandler } from '@nevis-security/nevis-mobile-authentication-sdk-react';

import * as RootNavigation from '../utility/RootNavigation';

const useTransactionConfirmationViewModel = () => {
	async function confirm(
		selectedUsername: string,
		accountSelectionHandler?: AccountSelectionHandler
	) {
		await accountSelectionHandler?.username(selectedUsername);
	}

	async function cancel(accountSelectionHandler?: AccountSelectionHandler) {
		await accountSelectionHandler?.cancel();
		RootNavigation.goToHome();
	}

	return {
		confirm,
		cancel,
	};
};

export default useTransactionConfirmationViewModel;
