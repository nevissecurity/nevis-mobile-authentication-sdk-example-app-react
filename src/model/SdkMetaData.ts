/**
 * Copyright © 2025 Nevis Security AG. All rights reserved.
 */

export class SdkMetaData {
	version: string;
	facetId: string;
	certificateFingerprint?: string;

	constructor(version: string, facetId: string, certificateFingerprint?: string) {
		this.version = version;
		this.facetId = facetId;
		this.certificateFingerprint = certificateFingerprint;
	}
}
