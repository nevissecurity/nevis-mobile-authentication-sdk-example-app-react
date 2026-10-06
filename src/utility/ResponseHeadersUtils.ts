/**
 * Copyright © 2026 Nevis Security AG. All rights reserved.
 */

import { ResponseHeaders } from '@nevis-security/nevis-mobile-authentication-sdk-react';

export function headerAsString(headers: ResponseHeaders | undefined): string {
	if (!headers) {
		return 'undefined';
	}
	return JSON.stringify(Object.fromEntries(headers.values));
}
