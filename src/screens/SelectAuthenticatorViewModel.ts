/**
 * Copyright © 2023 Nevis Security AG. All rights reserved.
 */

import { AuthenticatorSelectionHandler } from '@nevis-security/nevis-mobile-authentication-sdk-react';

import { ErrorHandler } from '../error/ErrorHandler';
import { OperationType } from '../model/OperationType';

const useSelectAuthenticatorViewModel = () => {
	async function select(aaid: string, handler?: AuthenticatorSelectionHandler) {
		await handler?.aaid(aaid).catch(ErrorHandler.handle.bind(null, OperationType.unknown));
	}

	return {
		select,
	};
};

export default useSelectAuthenticatorViewModel;
