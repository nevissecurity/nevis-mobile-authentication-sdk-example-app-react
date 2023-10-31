/**
 * Copyright © 2023 Nevis Security AG. All rights reserved.
 */

import { type MobileAuthenticationClient } from '@nevis-security/nevis-mobile-authentication-sdk-react';

export class ClientProvider {
	private static instance: ClientProvider;
	private _client?: MobileAuthenticationClient;

	private constructor() {}

	static getInstance(): ClientProvider {
		if (!ClientProvider.instance) {
			ClientProvider.instance = new ClientProvider();
		}

		return ClientProvider.instance;
	}

	get client(): MobileAuthenticationClient | undefined {
		return this._client;
	}

	set client(value: MobileAuthenticationClient) {
		this._client = value;
	}
}
