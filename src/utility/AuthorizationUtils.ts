/**
 * Copyright © 2023 Nevis Security AG. All rights reserved.
 */

import {
	AuthorizationProvider,
	CookieAuthorizationProvider,
	CookieSessionProvider,
	JwtAuthorizationProvider,
	JwtSessionProvider,
	SessionProvider,
} from '@nevis-security/nevis-mobile-authentication-sdk-react';

export class AuthorizationUtils {
	static printAuthorizationInfo(authorizationProvider?: AuthorizationProvider) {
		if (authorizationProvider) {
			if (authorizationProvider instanceof CookieAuthorizationProvider) {
				console.log(
					`Cookies received: ${JSON.stringify(authorizationProvider.cookies, null, ' ')}}`
				);
			} else if (authorizationProvider instanceof JwtAuthorizationProvider) {
				console.log(`Received JWT is ${authorizationProvider.jwt}`);
			}
		} else {
			console.log('No authorization provider received.');
		}
	}

	static printSessionInfo(sessionProvider?: SessionProvider) {
		if (sessionProvider) {
			if (sessionProvider instanceof CookieSessionProvider) {
				console.log(`Cookies received: ${sessionProvider.cookies}`);
			} else if (sessionProvider instanceof JwtSessionProvider) {
				console.log(`Received JWT is ${sessionProvider.jwt}`);
			}
		} else {
			console.log('No session provider received.');
		}
	}
}
