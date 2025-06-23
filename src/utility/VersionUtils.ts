/**
 * Copyright © 2025 Nevis Security AG. All rights reserved.
 */

import { Version } from '@nevis-security/nevis-mobile-authentication-sdk-react';

export class VersionUtils {
	static formatted(version: Version) {
		return `${version.major}.${version.minor}.${version.patch}.${version.buildNumber}`;
	}
}
